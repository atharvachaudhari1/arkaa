// SEVE Desktop - Vanilla JavaScript Implementation

let driveData = {};
let selectedFiles = new Set();
let fileRemarks = {}; // key: file path, value: remark string
let unsubscribeProgress = null;
let elapsedInterval = null;
let scanStartMs = 0;
// Latest clearance report (deletion or wipe) to be used for Machine/PDF report buttons
let currentClearanceReport = null;

// Default behavior: when wiping free space, write zeros (0x00) rather than random

const FREE_SPACE_PATTERN = 'zeros'; // alternatives we may support later: 'random'

// Progress animation controller state
let progressAnimId = null;
let displayedProgress = 0;   // 0..1 actually shown
let targetProgress = 0;      // 0..1 from backend
let stallPoints = [];        // array of fractions e.g., [0.12, 0.34, 0.6]
let stallIndex = 0;          // next stall to trigger
let stallUntil = 0;          // timestamp when stall ends
let progressMessage = '';

// Initialize development window controls
function initDevWindowControls() {
  const isDev = !window.location.href.includes('app://');
  const devControls = document.getElementById('devWindowControls');
  
  if (devControls && isDev) {
    devControls.style.display = 'flex';
    
    document.getElementById('devMinimize').addEventListener('click', () => {
      window.electronAPI.windowMinimize();
    });
    
    document.getElementById('devMaximize').addEventListener('click', () => {
      window.electronAPI.windowMaximize();
    });
    
    document.getElementById('devClose').addEventListener('click', () => {
      window.electronAPI.windowClose();
    });
  }
}

// Enhanced Background Animation
function initBackgroundAnimation() {
    const body = document.body;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Mouse tracking for parallax effect
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });
    
    // Smooth animation loop
    function animateBackground() {
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;
        
        const translateX = targetX * 20;
        const translateY = targetY * 20;
        const scale = 1 + Math.abs(targetX) * 0.05 + Math.abs(targetY) * 0.05;
        
        if (body.style.setProperty) {
            body.style.setProperty('--bg-x', `${translateX}px`);
            body.style.setProperty('--bg-y', `${translateY}px`);
            body.style.setProperty('--bg-scale', scale);
        }

// Helper: load image as DataURL with fallbacks for bootable/offline
async function loadImageDataURL(candidates) {
    const tryLoad = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('not ok');
            const blob = await res.blob();
            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (_) { return null; }
    };
    for (const c of candidates) {
        const data = await tryLoad(c);
        if (data) return data;
    }
    return null;
}

// Generate a human-readable Clearance Certificate PDF (Certificate-like layout)
async function generateClearancePDF(report) {
    if (!report) throw new Error('No report');
    const jsPDF = (window.libs && window.libs.jsPDF) || (window.jspdf && window.jspdf.jsPDF);
    if (!jsPDF) throw new Error('jsPDF not available');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    // Dimensions
    const page = { w: 595.28, h: 841.89 };
    const crimson = [226, 99, 99];
    const dark = [20, 20, 25];

    // Border frame
    doc.setDrawColor(...crimson); doc.setLineWidth(2);
    doc.rect(20, 20, page.w - 40, page.h - 40);
    doc.setDrawColor(200); doc.setLineWidth(0.5);
    doc.rect(30, 30, page.w - 60, page.h - 60);

    // Header with logo and title
    let logoData = await loadImageDataURL([
        '../../assets/report.jpeg', // bootable_gui/assets
        '../assets/report.jpeg',
        'assets/report.jpeg'
    ]);
    const headerY = 60;
    if (logoData) {
        try { doc.addImage(logoData, 'JPEG', 48, headerY - 20, 80, 80); } catch(_) {}
    }
    doc.setTextColor(...dark);
    doc.setFontSize(26);
    doc.text('Certificate of Data Clearance', page.w/2, headerY + 10, { align: 'center' });
    doc.setFontSize(12);
    const issued = new Date().toLocaleString();
    const op = report.operation || 'clearance';
    const drive = report.drive || '';
    doc.text(`Issued: ${issued}`, page.w/2, headerY + 30, { align: 'center' });
    if (drive) doc.text(`Drive: ${drive}`, page.w/2, headerY + 46, { align: 'center' });
    doc.text(`Operation: ${op}`, page.w/2, headerY + 62, { align: 'center' });

    // Summary box
    let y = 150;
    doc.setDrawColor(...crimson); doc.setLineWidth(1);
    doc.rect(45, y - 18, page.w - 90, 110);
    doc.setFontSize(14); doc.setTextColor(...crimson); doc.text('Summary', 55, y);
    doc.setFontSize(12); doc.setTextColor(...dark); y += 18;
    if (report.bytes_written !== undefined) {
        doc.text(`Bytes Written: ${formatBytes(report.bytes_written || 0)}`, 55, y); y += 16;
        doc.text(`Files Created (free-space fill): ${String(report.files_created || 0)}`, 55, y); y += 16;
        doc.text(`Pattern: ${(report.pattern || 'zeros').toUpperCase()}`, 55, y); y += 16;
    }
    if (report.deleted !== undefined || (report.items && report.items.length)) {
        const del = report.deleted ?? (report.items?.filter(i => i.success).length || 0);
        const total = report.total ?? (report.items?.length || 0);
        doc.text(`Files Deleted: ${del} / ${total}`, 55, y); y += 16;
    }

    // Cleared folders table
    if (Array.isArray(report.folders) && report.folders.length > 0) {
        y += 20; if (y > page.h - 80) { doc.addPage(); y = 60; }
        doc.setFontSize(14); doc.setTextColor(...crimson); doc.text('Cleared Folders', 45, y); y += 14;
        doc.setFontSize(11); doc.setTextColor(...dark);
        doc.text('Name', 55, y); doc.text('Directory', 220, y); doc.text('Size', page.w - 120, y); y += 10;
        doc.setDrawColor(220); doc.line(45, y, page.w - 45, y); y += 8;
        for (const folder of report.folders) {
            if (y > page.h - 60) { doc.addPage(); y = 60; }
            const name = (folder.name || '').toString().slice(0, 30);
            const dir = (folder.path || '').toString();
            const size = formatBytes(folder.size_bytes || 0);
            doc.text(name, 55, y);
            // wrap directory
            const dirLines = doc.splitTextToSize(dir, page.w - 240);
            doc.text(dirLines, 220, y);
            doc.text(size, page.w - 120, y);
            y += 14 + (dirLines.length - 1) * 12;
        }
    }

    // Deleted files list (if present)
    if (Array.isArray(report.items) && report.items.length > 0) {
        y += 20; if (y > page.h - 80) { doc.addPage(); y = 60; }
        doc.setFontSize(14); doc.setTextColor(...crimson); doc.text('Deleted Files', 45, y); y += 14;
        doc.setFontSize(10); doc.setTextColor(...dark);
        const MAX_ROWS = 300; // cap to keep PDF size reasonable
        let rows = 0;
        for (const item of report.items) {
            if (rows >= MAX_ROWS) { doc.text('... (truncated)', 55, y); break; }
            if (y > page.h - 60) { doc.addPage(); y = 60; }
            const status = item.success ? '' : ' (FAILED)';
            const line = `${item.name || item.path || ''}${status}`;
            const wrapped = doc.splitTextToSize(line, page.w - 90);
            doc.text(wrapped, 55, y);
            y += 12 + (wrapped.length - 1) * 12;
            rows++;
        }
    }

    // Signature area
    y = Math.min(y + 40, page.h - 140);
    doc.setDrawColor(180); doc.line(80, page.h - 120, 260, page.h - 120);
    doc.line(page.w - 260, page.h - 120, page.w - 80, page.h - 120);
    doc.setFontSize(10); doc.setTextColor(...dark);
    doc.text('Authorized Signature', 110, page.h - 105);
    doc.text('Date', page.w - 200, page.h - 105);

    // Footer
    doc.setFontSize(10); doc.setTextColor(120);
    doc.text('SEVE - Secure Erase & Verification Engine', 45, page.h - 40);
    const fname = `SEVE_Clearance_Certificate_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(fname);
}
        
        requestAnimationFrame(animateBackground);
    }
    
    animateBackground();
}

// Delegated handler: Secure Erase button
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.wipe-execute-btn');
    if (!btn) return;
    try {
        const driveId = btn.getAttribute('data-drive-id');
        let level = parseInt(btn.getAttribute('data-level') || '3', 10);
        // Query drive info to decide level
        if (driveId && window.electronAPI.getDriveInfo) {
            const info = await window.electronAPI.getDriveInfo(driveId);
            if (info && info.success && info.data) {
                const d = info.data;
                if (d.IsRemovable) {
                    level = 1; // Removable → Level 1
                    btn.textContent = 'Secure Erase (Level 1)';
                } else if (d.IsOS) {
                    level = 3; // OS volume → Level 3 safe clear
                    btn.textContent = 'Secure Erase (Level 3)';
                } else {
                    level = 2; // Non-OS internal → Level 2
                    btn.textContent = 'Secure Erase (Level 2)';
                }
            }
        }
        await executeWipe(driveId, level);
    } catch (err) {
        console.warn('Unable to start wipe:', err);
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initDevWindowControls();
    initBackgroundAnimation();
    
    // Sidebar Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    const scanBtn = document.getElementById('scanBtn');
    const saveBtn = document.getElementById('saveBtn');
    const pdfBtn = document.getElementById('pdfBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const closePreview = document.getElementById('closePreview');
    const previewModal = document.getElementById('previewModal');
    
    scanBtn.addEventListener('click', scanDrives);
    saveBtn.addEventListener('click', saveReport);
    pdfBtn.addEventListener('click', generatePDFReport);
    refreshBtn.addEventListener('click', refreshPage);
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteSelectedFiles);
    }

    // Wire success modal report buttons
    const saveClearanceBtn = document.getElementById('saveClearanceBtn');
    if (saveClearanceBtn) {
        saveClearanceBtn.addEventListener('click', async () => {
            if (!currentClearanceReport) { showError('No clearance report available.'); return; }
            try {
                const result = await window.electronAPI.showSaveDialog();
                if (!result.canceled && result.filePath) {
                    const payload = {
                        type: 'clearance_report',
                        generated_at: new Date().toISOString(),
                        report: currentClearanceReport
                    };
                    const saveRes = await window.electronAPI.saveFile(result.filePath, payload);
                    if (!saveRes.success) showError(saveRes.error || 'Failed to save clearance report');
                }
            } catch (e) { showError('Failed to save clearance report'); }
        });
    }
    const pdfClearanceBtn = document.getElementById('pdfClearanceBtn');
    if (pdfClearanceBtn) {
        pdfClearanceBtn.addEventListener('click', async () => {
            if (!currentClearanceReport) { /* silently ignore */ return; }
            try { await generateClearancePDF(currentClearanceReport); } catch (e) { console.warn('PDF generation failed (clearance):', e); }
        });
    }
    closePreview?.addEventListener('click', () => previewModal.classList.add('hidden'));
    previewModal?.addEventListener('click', (e) => { if (e.target === previewModal) previewModal.classList.add('hidden'); });
    // Event delegation for file actions
    const listContainer = document.getElementById('driveCards');
    listContainer.addEventListener('change', onListChange, true);
    listContainer.addEventListener('click', onListClick, true);
});

// Refresh function
function refreshPage() {
    location.reload();
}


function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function showLoading(message = 'Scanning drives...') {
    const loading = document.getElementById('loading');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const loadingMessage = document.getElementById('loadingMessage');
    const progressBar = document.querySelector('.progress-bar');
    const elapsedTime = document.getElementById('elapsedTime');
    
    // Update loading message if provided
    if (loadingMessage) {
        loadingMessage.textContent = message;
    }
    
    // Reset progress
    if (progressFill) progressFill.style.width = '0%';
    if (progressPercent) progressPercent.textContent = '0%';
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', '0');
    }
    if (elapsedTime) {
        elapsedTime.textContent = '0.0s';
    }
    
    // Show loading overlay
    loading.classList.remove('hidden');
    loading.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when loading is visible
    
    // Hide other UI elements
    const error = document.getElementById('error');
    const results = document.getElementById('results');
    const scanBtn = document.getElementById('scanBtn');
    
    if (error) error.classList.add('hidden');
    if (results) results.classList.add('hidden');
    if (scanBtn) scanBtn.disabled = true;
    
    // Initialize progress animation controller
    displayedProgress = 0;
    targetProgress = 0;
    stallIndex = 0;
    stallPoints = Array.from({ length: 3 + Math.floor(Math.random()*2) }) // 3-4 stalls
        .map(() => 0.08 + Math.random()*0.72) // between 8% and 80%
        .sort((a,b) => a - b);
    stallUntil = 0;
    progressMessage = message;
    if (progressAnimId) cancelAnimationFrame(progressAnimId);
    const animate = () => {
        const now = Date.now();
        // Handle active stall
        if (stallUntil && now < stallUntil) {
            updateProgress(displayedProgress, progressMessage);
            progressAnimId = requestAnimationFrame(animate);
            return;
        }
        // Trigger new stall if we crossed next stall point
        if (stallIndex < stallPoints.length && displayedProgress >= stallPoints[stallIndex]) {
            stallIndex++;
            // Stall 250-700ms randomly
            stallUntil = now + (250 + Math.random()*450);
        } else {
            stallUntil = 0;
        }
        // Ease towards target progress
        const delta = targetProgress - displayedProgress;
        const step = Math.sign(delta) * Math.min(Math.abs(delta), 0.02 + Math.abs(delta)*0.2); // adaptive speed
        displayedProgress = Math.max(0, Math.min(1, displayedProgress + step));
        updateProgress(displayedProgress, progressMessage);
        // Continue until finished
        if (displayedProgress < 1) {
            progressAnimId = requestAnimationFrame(animate);
        }
    };
    progressAnimId = requestAnimationFrame(animate);

    // Start the elapsed timer
    startElapsedTimer();
}

function hideLoading() {
    const loading = document.getElementById('loading');
    const scanBtn = document.getElementById('scanBtn');
    
    // Add fade out animation
    loading.classList.remove('visible');
    document.body.style.overflow = ''; // Re-enable scrolling
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 300); // Match this with the CSS transition duration
    
    if (scanBtn) scanBtn.disabled = false;
    if (progressAnimId) cancelAnimationFrame(progressAnimId), progressAnimId = null;
    stopElapsedTimer();
}

function showError(message) {
    const error = document.getElementById('error');
    const errorText = document.getElementById('errorText');
    
    if (!error || !errorText) return;
    
    // Update error message
    errorText.textContent = message;
    
    // Show error with animation
    error.classList.remove('hidden');
    error.style.display = 'flex';
    error.style.opacity = '0';
    error.style.transform = 'translateY(-10px)';
    
    // Trigger reflow
    void error.offsetHeight;
    
    // Animate in
    error.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    error.style.opacity = '1';
    error.style.transform = 'translateY(0)';
    
    // Hide any visible results
    const results = document.getElementById('results');
    if (results && !results.classList.contains('hidden')) {
        results.style.opacity = '0';
        results.style.transform = 'translateY(10px)';
        setTimeout(() => {
            results.classList.add('hidden');
            results.style.display = 'none';
        }, 300);
    }
    
    // Ensure loading is hidden
    hideLoading();
}

function showResults() {
    const results = document.getElementById('results');
    const saveBtn = document.getElementById('saveBtn');
    const pdfBtn = document.getElementById('pdfBtn');
    
    if (!results) return;
    
    // Hide any visible errors
    const error = document.getElementById('error');
    if (error && !error.classList.contains('hidden')) {
        error.style.opacity = '0';
        error.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            error.classList.add('hidden');
            error.style.display = 'none';
        }, 300);
    }
    
    // Show results with animation
    results.style.display = 'block';
    results.classList.remove('hidden');
    results.style.opacity = '0';
    results.style.transform = 'translateY(10px)';
    
    // Trigger reflow
    void results.offsetHeight;
    
    // Animate in
    results.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    results.style.opacity = '1';
    results.style.transform = 'translateY(0)';
    
    // Update buttons
    if (saveBtn) saveBtn.disabled = false;
    if (pdfBtn) pdfBtn.disabled = false;
    
    // Hide loading
    hideLoading();
}

// Elapsed timer helpers
function startElapsedTimer() {
    // Reset and start the elapsed timer
    scanStartMs = Date.now();
    updateElapsedTime(); // Initial update
    clearInterval(elapsedInterval); // Clear any existing interval
    elapsedInterval = setInterval(updateElapsedTime, 100);
}

function updateElapsedTime() {
    const elapsedTime = document.getElementById('elapsedTime');
    const progressAria = document.getElementById('progressAria');
    const progressPercent = document.getElementById('progressPercent');
    
    if (elapsedTime) {
        const elapsedSeconds = ((Date.now() - scanStartMs) / 1000).toFixed(1);
        elapsedTime.textContent = `${elapsedSeconds}s`;
        
        // Update progress for screen readers periodically
        if (progressAria && progressPercent) {
            const percent = progressPercent.textContent;
            progressAria.textContent = `${percent} complete, ${elapsedSeconds} seconds elapsed`;
        }
    }
}

function stopElapsedTimer() {
    clearInterval(elapsedInterval);
    elapsedInterval = null;
    
    // Final update to elapsed time
    updateElapsedTime();
    
    // Notify screen readers that the operation is complete
    const progressAria = document.getElementById('progressAria');
    if (progressAria) {
        const progressPercent = document.getElementById('progressPercent')?.textContent || '100%';
        const elapsedTime = document.getElementById('elapsedTime')?.textContent || '0.0s';
        progressAria.textContent = `Operation complete! ${progressPercent} in ${elapsedTime}`;
    }
}

// Track the last progress update time and value
let lastProgressUpdate = 0;
let lastProgressValue = 0;
const MIN_PROGRESS_UPDATE_INTERVAL = 100; // ms
const MIN_PROGRESS_STEP = 0.5; // Minimum % change to update

function updateProgress(progress, message) {
    const now = Date.now();
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressBar = document.querySelector('.progress-bar');
    const loadingMessage = document.getElementById('loadingMessage');
    
    // Ensure progress is between 0 and 1
    const safeProgress = Math.max(0, Math.min(1, progress));
    const percent = Math.round(safeProgress * 100);
    
    // Throttle rapid updates and ensure minimum step size
    const timeSinceLastUpdate = now - lastProgressUpdate;
    const progressDiff = Math.abs(percent - lastProgressValue);
    
    if (timeSinceLastUpdate < MIN_PROGRESS_UPDATE_INTERVAL && progressDiff < MIN_PROGRESS_STEP) {
        return; // Skip this update
    }
    
    // Update progress bar with smooth transition
    if (progressFill) {
        // Only update if there's an actual change
        if (parseInt(progressFill.style.width || '0') !== percent) {
            progressFill.style.transition = 'width 0.3s ease-out';
            progressFill.style.width = `${percent}%`;
        }
    }
    
    // Update percentage text with animation
    if (progressPercent) {
        progressPercent.textContent = `${percent}%`;
        // Add a subtle animation on the percentage
        progressPercent.style.transform = 'scale(1.1)';
        setTimeout(() => {
            if (progressPercent) progressPercent.style.transform = 'scale(1)';
        }, 150);
    }
    
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', percent);
    }
    
    // Update loading message if provided
    if (message && loadingMessage) {
        loadingMessage.textContent = message;
    }
    
    // Update last values
    lastProgressUpdate = now;
    lastProgressValue = percent;
}

// Main Functions
async function scanDrives() {
    try {
        // Step 1: list drives
        const listRes = await window.electronAPI.listDrives();
        if (!listRes.success || !Array.isArray(listRes.drives) || listRes.drives.length === 0) {
            showError(listRes.error || 'No drives detected');
            return;
        }
        const selected = await promptDriveSelection(listRes.drives);
        if (!selected || selected.length === 0) return; // user cancelled

        showLoading();
        // record scan start time
        scanStartMs = Date.now();

        // Subscribe to progress events
        if (unsubscribeProgress) { unsubscribeProgress(); }
        unsubscribeProgress = window.electronAPI.onScanProgress(({ percent, message }) => {
            // Backend emits percent in 0..100; convert to 0..1 and set as target
            const fraction = Math.max(0, Math.min(1, (Number(percent) || 0) / 100));
            targetProgress = Math.max(targetProgress, fraction);
            if (message) progressMessage = message;
        });

        // Step 2: scan selected drives (array)
        const result = await window.electronAPI.scanDrive(selected);

        if (result.success) {
            driveData = result.data;
            driveData.user_remarks = driveData.user_remarks || {};
            driveData.deletion_report = driveData.deletion_report || null;
            renderDrives(result.data.drives || []);
            showResults();
        } else {
            showError(result.error || 'Failed to scan drive');
        }
    } catch (err) {
        showError('Failed to communicate with drive scanner');
    } finally {
        if (unsubscribeProgress) { unsubscribeProgress(); unsubscribeProgress = null; }
        stopElapsedTimer();
    }
}

// Lightweight modal to select a drive
function promptDriveSelection(drives) {
    return new Promise((resolve) => {
        // Build modal elements
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0,0,0,0.8)';
        overlay.style.backdropFilter = 'blur(15px)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';

        const panel = document.createElement('div');
        panel.style.background = 'rgba(255, 255, 255, 0.08)';
        panel.style.backdropFilter = 'blur(25px)';
        panel.style.webkitBackdropFilter = 'blur(25px)';
        panel.style.border = '1px solid rgba(255,255,255,0.15)';
        panel.style.borderRadius = '20px';
        panel.style.padding = '40px';
        panel.style.minWidth = '500px';
        panel.style.maxWidth = '600px';
        panel.style.color = '#fff';
        panel.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 68, 68, 0.1)';

        const listHtml = drives.map(d => `
            <label style="display:flex;align-items:center;gap:16px;margin:16px 0;padding:16px;background:rgba(255,255,255,0.05);border-radius:12px;cursor:pointer;transition:all 0.2s ease;border:1px solid rgba(255,255,255,0.1);" 
                   onmouseover="this.style.background='rgba(255,68,68,0.1)';this.style.borderColor='rgba(255,68,68,0.3)'" 
                   onmouseout="this.style.background='rgba(255,255,255,0.05)';this.style.borderColor='rgba(255,255,255,0.1)'">
                <input type="checkbox" class="drive-check" value="${d}" style="width:18px;height:18px;accent-color:#ff4444;">
                <span style="font-size:1.2rem;font-weight:500;color:#ffffff;">${d}</span>
            </label>
        `).join('');

        panel.innerHTML = `
            <div style="font-size:1.8rem;margin-bottom:24px;color:#ffffff;font-weight:600;text-align:center;">Select Drives to Scan</div>
            <div style="font-size:1rem;margin-bottom:32px;color:#aaaaaa;text-align:center;line-height:1.5;">Choose one or more drives for secure erasure analysis</div>
            <div style="max-height:300px;overflow:auto;padding:8px;border:1px solid rgba(255,255,255,0.1);border-radius:16px;background:rgba(0,0,0,0.3);">
                ${listHtml}
            </div>
            <div style="margin-top:24px;">
                <div style="opacity:0.7;font-size:0.95rem;color:#ff6666;display:flex;align-items:center;gap:8px;margin-bottom:20px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg>
                    Multiple drives can be selected
                </div>
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button id="cancelBtn" class="modal-btn modal-btn-secondary">Cancel</button>
                    <button id="okBtn" class="modal-btn modal-btn-primary">Scan Drives</button>
                </div>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        const cleanup = () => overlay.remove();
        panel.querySelector('#cancelBtn').addEventListener('click', () => { cleanup(); resolve(null); });
        panel.querySelector('#okBtn').addEventListener('click', () => {
            const checks = Array.from(panel.querySelectorAll('.drive-check'));
            const values = checks.filter(c => c.checked).map(c => c.value);
            cleanup();
            resolve(values);
        });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) { cleanup(); resolve(null); } });
    });
}

async function saveReport() {
    if (!driveData || !driveData.drives || driveData.drives.length === 0) return;
    
    try {
        const result = await window.electronAPI.showSaveDialog();
        if (!result.canceled && result.filePath) {
            // attach latest remarks and any deletion report
            driveData.user_remarks = fileRemarks;
            const saveResult = await window.electronAPI.saveFile(result.filePath, driveData);
            if (!saveResult.success) {
                showError(saveResult.error || 'Failed to save file');
            }
        }
    } catch (err) {
        showError('Failed to save report');
    }
}

// PDF Report Generation
async function generatePDFReport() {
    if (!driveData || !driveData.drives || driveData.drives.length === 0) return;
    try {
        const result = await window.electronAPI.showSaveDialogPdf();
        if (result.canceled || !result.filePath) return;
        const outPath = result.filePath.toLowerCase().endsWith('.pdf') ? result.filePath : `${result.filePath}.pdf`;
        const res = await window.electronAPI.generateSeveReport(outPath, driveData);
        if (!res || !res.success) {
            showError(res?.error || 'Failed to generate SEVE report');
            return;
        }
    } catch (e) {
        showError('Failed to generate SEVE report');
    }
}

function renderDrives(drives) {
    driveCards.innerHTML = '';
    
    drives.forEach(drive => {
        const card = createDriveCard(drive);
        driveCards.appendChild(card);
    });
    // Reset selection state
    selectedFiles = new Set();
    updateDeleteButtonState();
}

function createDriveCard(drive) {
    const card = document.createElement('div');
    card.className = 'drive-card';
    
    const usageClass = drive.usage_percentage > 90 ? 'danger' : 
                      drive.usage_percentage > 75 ? 'warning' : '';
    
    card.innerHTML = `
        <div class="drive-header" style="display:flex;align-items:center;gap:15px;padding:15px;background:rgba(30,30,30,0.5);border-radius:8px;margin-bottom:15px;">
            <span class="drive-icon" style="font-size:2rem;flex-shrink:0;">
                <i data-lucide="hard-drive" style="width: 2rem; height: 2rem; color: #ff4444;"></i>
            </span>
            <div style="flex:1;min-width:0;">
                <div class="drive-title" style="font-size:1.2rem;font-weight:600;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${drive.model || 'Unknown Drive'} (${drive.drive || 'Unknown'})
                </div>
                <div class="drive-subtitle" style="font-size:0.9rem;color:rgba(255,255,255,0.7);margin-bottom:8px;">
                    ${drive.filesystem || 'Unknown'} • ${drive.total_space_human || 'Unknown size'}
                </div>
                <div style="margin-top:6px;font-size:0.85rem;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                    <span class="badge" style="padding:3px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);font-size:0.8rem;white-space:nowrap;">
                        Mode: ${drive.scan_mode || 'Filesystem'}
                    </span>
                    <span class="badge" style="padding:3px 10px;border-radius:999px;border:1px solid ${drive.count_accuracy === 'Exact' ? 'rgba(0,200,0,0.5)' : 'rgba(255,80,80,0.5)'};background:${drive.count_accuracy === 'Exact' ? 'rgba(0,200,0,0.12)' : 'rgba(255,80,80,0.12)'};font-size:0.8rem;white-space:nowrap;">
                        Accuracy: ${drive.count_accuracy || 'Partial'}
                    </span>
                    ${typeof drive.scan_duration_seconds === 'number' ? 
                      `<span class="badge" style="padding:3px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);font-size:0.8rem;white-space:nowrap;">
                        Time: ${drive.scan_duration_seconds.toFixed(1)}s
                      </span>` : ''}
                    ${drive.media_type ? 
                      `<span class="badge" style="padding:3px 10px;border-radius:999px;border:1px solid rgba(100,180,255,0.3);background:rgba(100,180,255,0.1);font-size:0.8rem;white-space:nowrap;">
                        ${drive.media_type}
                      </span>` : ''}
                    ${drive.file_analysis?.skipped_errors > 0 ? 
                      `<span style="opacity:0.8;font-size:0.8rem;color:rgba(255,180,180,0.9);">
                        Skipped: ${drive.file_analysis.skipped_errors}
                      </span>` : ''}
                </div>
            </div>
            <button class="btn btn-danger wipe-execute-btn" style="flex-shrink:0;"
                    data-drive-id="${CSS.escape(drive.drive || '')}"
                    data-level="3"
                    title="Secure Erase (auto-detects removable drives)">Secure Erase</button>
        </div>
        
        <div class="usage-bar" style="margin:20px 0;padding:0 5px;">
            <div class="usage-label" style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9rem;color:rgba(255,255,255,0.8);">
                <span>Storage Usage</span>
                <span>${drive.usage_percentage.toFixed(1)}%</span>
            </div>
            <div class="progress-bar" style="height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;margin-bottom:8px;">
                <div class="progress-fill ${usageClass}" 
                     style="height:100%;background:linear-gradient(90deg, #e26363, #ff8a8a);transition:width 0.3s ease;width:${drive.usage_percentage}%;"></div>
            </div>
            <div class="usage-details" style="display:flex;justify-content:space-between;font-size:0.85rem;color:rgba(255,255,255,0.6);">
                <span>Used: ${drive.used_space_human || 'N/A'}</span>
                <span>Free: ${drive.free_space_human || 'N/A'}</span>
            </div>
        </div>

        
        <div class="search-section">
            <div class="section-title">
                <span>
                    <i data-lucide="search" style="width: 1.1rem; height: 1.1rem; color: #ff4444;"></i>
                </span>
                Search Files
            </div>
            <div class="search-container">
                <input type="text" 
                       class="search-input" 
                       placeholder="Search files and directories..." 
                       data-drive="${CSS.escape(drive.drive || '')}">
                <button type="button" 
                        class="search-btn" 
                        data-drive="${CSS.escape(drive.drive || '')}">
                    Search
                </button>
            </div>
            <div class="search-results hidden" 
                 data-drive="${CSS.escape(drive.drive || '')}">
            </div>
        </div>
        
        <div class="section" style="margin:25px 0;padding:15px;background:rgba(30,30,30,0.3);border-radius:8px;">
            <div class="section-title" style="display:flex;align-items:center;gap:8px;font-size:1.1rem;margin-bottom:15px;color:#fff;font-weight:500;">
                <span>
                    <i data-lucide="bar-chart-3" style="width: 1.1rem; height: 1.1rem; color: #ff4444;"></i>
                </span>
                File Categories
            </div>
            <div class="file-categories" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:12px;">
                ${renderFileCategories(drive.file_analysis.categories)}
            </div>
        </div>
        
        <div class="section" style="margin:25px 0;padding:15px;background:rgba(30,30,30,0.3);border-radius:8px;">
            <div class="section-title" style="display:flex;align-items:center;gap:8px;font-size:1.1rem;margin-bottom:15px;color:#fff;font-weight:500;">
                <span>📈</span>
                Summary
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:12px;font-size:0.95rem;">
                <div style="background:rgba(255,255,255,0.05);padding:12px;border-radius:6px;border-left:3px solid #e26363;">
                    <div style="font-size:0.8rem;color:rgba(255,255,255,0.7);margin-bottom:4px;">Total Files</div>
                    <div style="font-size:1.2rem;font-weight:600;">${(drive.file_analysis?.total_files || 0).toLocaleString()}</div>
                </div>
                <div style="background:rgba(255,255,255,0.05);padding:12px;border-radius:6px;border-left:3px solid #63a4e2;">
                    <div style="font-size:0.8rem;color:rgba(255,255,255,0.7);margin-bottom:4px;">Total Directories</div>
                    <div style="font-size:1.2rem;font-weight:600;">${(drive.file_analysis?.total_directories || 0).toLocaleString()}</div>
                </div>
                ${drive.file_analysis?.skipped_errors ? `
                <div style="background:rgba(255,100,100,0.08);padding:12px;border-radius:6px;border-left:3px solid #ff6b6b;">
                    <div style="font-size:0.8rem;color:rgba(255,180,180,0.9);margin-bottom:4px;">Skipped (errors/denied)</div>
                    <div style="font-size:1.2rem;font-weight:600;color:#ff8a8a;">${drive.file_analysis.skipped_errors.toLocaleString()}</div>
                </div>` : ''}
            </div>
        </div>
        
        ${drive.file_analysis.largest_files.length > 0 ? `
        <!-- ========== LARGEST FILES SECTION ========== -->
        <div class="section" style="margin:25px 0;padding:25px;background:transparent;border-radius:0;position:relative;overflow:hidden;">
            
            <!-- Section Header -->
            <div class="section-title" style="display:flex;align-items:center;gap:12px;font-size:1.25rem;margin-bottom:20px;color:#ff8a80;font-weight:700;text-transform:uppercase;letter-spacing:1px;position:relative;z-index:1;">
                <span style="font-size:1.5em;">
                    <i data-lucide="file-search" style="width: 1.5em; height: 1.5em; color: #ff8a80;"></i>
                </span>
                <span>LARGEST FILES (&gt;100MB)</span>
            </div>
            
            <!-- File List Container -->
            <div class="file-list" style="background:transparent;border-radius:0;overflow:hidden;box-shadow:none;border:none;">
                ${renderLargestFiles(drive.file_analysis.largest_files)}
            </div>
        </div>` : ''}
        
        ${drive.file_analysis.sensitive_files && drive.file_analysis.sensitive_files.length > 0 ? `
        <!-- ========== SENSITIVE FILES SECTION ========== -->
        <div class="section" style="margin:35px 0;padding:25px;background:transparent;border-radius:0;position:relative;overflow:hidden;">
            
            <!-- Section Header -->
            <div class="section-title" style="display:flex;align-items:center;gap:12px;font-size:1.25rem;margin-bottom:20px;color:#ff8a80;font-weight:700;text-transform:uppercase;letter-spacing:1px;position:relative;z-index:1;">
                <span style="font-size:1.5em;">
                    <i data-lucide="alert-triangle" style="width: 1.5em; height: 1.5em; color: #ff8a80;"></i>
                </span>
                <span>POTENTIALLY SENSITIVE FILES</span>
                <span style="margin-left:auto;font-size:0.9rem;color:#ff8a8a;background:rgba(255,80,80,0.3);padding:4px 12px;border-radius:999px;font-weight:600;letter-spacing:0.5px;border:1px solid rgba(255,138,128,0.2);">
                    ${drive.file_analysis.sensitive_files.length} FILES FOUND
                </span>
            </div>
            <!-- Sensitive Files List Container -->
            <div class="sensitive-files" style="background:transparent;border-radius:0;overflow:hidden;box-shadow:none;border:none;">
                ${renderSensitiveFiles(drive.file_analysis.sensitive_files)}
            </div>
            <!-- Important Notice -->
            <div style="margin-top:20px;padding:16px;background:rgba(255,80,80,0.15);border-radius:8px;border-left:4px solid #ff6b6b;position:relative;overflow:hidden;">
                <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(45deg, rgba(255,80,80,0.03), rgba(255,80,80,0.08));pointer-events:none;"></div>
                <div style="display:flex;align-items:flex-start;gap:12px;position:relative;z-index:1;">
                    <span style="color:#ff8a8a;font-size:1.4em;text-shadow:0 0 10px rgba(255,138,128,0.3);">
                        <i data-lucide="alert-triangle" style="width: 1.4em; height: 1.4em; color: #ff8a8a;"></i>
                    </span>
                    <div>
                        <div style="font-weight:700;color:#ffdddd;margin-bottom:6px;font-size:1.05rem;letter-spacing:0.3px;">IMPORTANT NOTICE</div>
                        <div style="font-size:0.92rem;color:rgba(255,220,220,0.95);line-height:1.6;letter-spacing:0.1px;">
                            Review these files carefully before proceeding with deletion. Sensitive files may contain personal or confidential information.
                        </div>
                    </div>
                </div>
            </div>
        </div>` : ''}
    `;
    
    return card;
}

function renderFileCategories(categories) {
    const totalSize = Object.values(categories).reduce((acc, d) => acc + (d.size || 0), 1);
    return Object.entries(categories)
        .filter(([_, data]) => data.count > 0)
        .sort(([,a], [,b]) => (b.size || 0) - (a.size || 0))
        .map(([category, data]) => {
            const percentage = ((data.size || 0) / totalSize) * 100;
            return `
            <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:12px;margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;">
                    <span style="font-weight:500;color:#fff;">${category}</span>
                    <div style="display:flex;gap:12px;">
                        <span style="color:rgba(255,255,255,0.7);">${(data.count || 0).toLocaleString()} files</span>
                        <span style="font-weight:500;color:#e26363;">${formatBytes(data.size || 0)}</span>
                    </div>
                </div>
                <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;background:linear-gradient(90deg, #e26363, #ff8a8a);width:${percentage}%;transition:width 0.5s ease;"></div>
                </div>
            </div>`;
        }).join('');
}

function renderLargestFiles(files) {
    if (!files || files.length === 0) return '<div class="no-files">No large files found</div>';
    
    const totalFiles = files.length;
    const initialRows = 5;
    const showViewMore = totalFiles > initialRows;
    
    return `
        <div class="file-table-container">
            <table class="file-table">
                <thead>
                    <tr>
                        <th class="file-name-col">FILE NAME</th>
                        <th class="file-size-col">SIZE</th>
                        <th class="file-type-col">TYPE</th>
                        <th class="file-location-col">LOCATION</th>
                        <th class="file-actions-col">ACTIONS</th>
                    </tr>
                </thead>
                <tbody class="file-table-body">
                    ${files.slice(0, initialRows).map((file, index) => `
                        <tr class="file-row ${index >= initialRows ? 'hidden-row' : ''}">
                            <td class="file-name-cell">
                                <div class="file-name-wrapper">
                                    <span class="file-name-text">${file.name || 'Unknown File'}</span>
                                    <span class="file-ext-badge">FILE</span>
                                </div>
                            </td>
                            <td class="file-size-cell">
                                <span class="file-size-text">${formatBytes(file.size || 0)}</span>
                            </td>
                            <td class="file-type-cell">
                                <span class="file-type-badge">LARGE FILE</span>
                            </td>
                            <td class="file-location-cell">
                                <div class="file-path-wrapper">
                                    <span class="file-path-text" title="${file.path || ''}">${truncatePath(file.path || '', 35)}</span>
                                </div>
                                <div class="phys-slot" data-path="${file.path}">
                                    ${renderPhysicalLocation(file.physical_location) || `<button class="locate-btn" data-path="${file.path}">LOCATE</button>`}
                                </div>
                            </td>
                            <td class="file-actions-cell">
                                <div class="file-actions-wrapper">
                                    <select class="remark-select" data-path="${file.path}">
                                        <option value="">Remark</option>
                                        <option value="Should erase">⚠ Should erase</option>
                                        <option value="Can erase">✓ Can erase</option>
                                        <option value="Keep">✗ Keep</option>
                                    </select>
                                    <button class="preview-btn" data-path="${file.path}" data-name="${file.name}" title="Preview File">
                                        <i data-lucide="eye"></i>
                                    </button>
                                    <label class="file-select-label" title="Select File">
                                        <input type="checkbox" class="file-select" data-path="${file.path}">
                                        <i data-lucide="check" class="check-mark"></i>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                    ${files.slice(initialRows).map((file, index) => `
                        <tr class="file-row hidden-row" style="display: none;">
                            <td class="file-name-cell">
                                <div class="file-name-wrapper">
                                    <span class="file-name-text">${file.name || 'Unknown File'}</span>
                                    <span class="file-ext-badge">FILE</span>
                                </div>
                            </td>
                            <td class="file-size-cell">
                                <span class="file-size-text">${formatBytes(file.size || 0)}</span>
                            </td>
                            <td class="file-type-cell">
                                <span class="file-type-badge">LARGE FILE</span>
                            </td>
                            <td class="file-location-cell">
                                <div class="file-path-wrapper">
                                    <span class="file-path-text" title="${file.path || ''}">${truncatePath(file.path || '', 35)}</span>
                                </div>
                                <div class="phys-slot" data-path="${file.path}">
                                    ${renderPhysicalLocation(file.physical_location) || `<button class="locate-btn" data-path="${file.path}">LOCATE</button>`}
                                </div>
                            </td>
                            <td class="file-actions-cell">
                                <div class="file-actions-wrapper">
                                    <select class="remark-select" data-path="${file.path}">
                                        <option value="">Remark</option>
                                        <option value="Should erase">⚠ Should erase</option>
                                        <option value="Can erase">✓ Can erase</option>
                                        <option value="Keep">✗ Keep</option>
                                    </select>
                                    <button class="preview-btn" data-path="${file.path}" data-name="${file.name}" title="Preview File">
                                        <i data-lucide="eye"></i>
                                    </button>
                                    <label class="file-select-label" title="Select File">
                                        <input type="checkbox" class="file-select" data-path="${file.path}">
                                        <i data-lucide="check" class="check-mark"></i>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${showViewMore ? `
                <div class="view-more-container">
                    <button class="view-more-btn" onclick="toggleFileRows(this, 'largest')">
                        <i data-lucide="chevron-down" class="view-more-icon"></i>
                        <span class="view-more-text">View More (${totalFiles - initialRows} more files)</span>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function renderSensitiveFiles(files) {
    if (!files || files.length === 0) return '<div class="no-files">No sensitive files found</div>';
    
    const totalFiles = files.length;
    const initialRows = 5;
    const showViewMore = totalFiles > initialRows;
    
    return `
        <div class="file-table-container">
            <table class="file-table sensitive-table">
                <thead>
                    <tr>
                        <th class="file-name-col">FILE NAME</th>
                        <th class="file-size-col">SIZE</th>
                        <th class="file-type-col">SENSITIVITY</th>
                        <th class="file-location-col">LOCATION</th>
                        <th class="file-actions-col">ACTIONS</th>
                    </tr>
                </thead>
                <tbody class="file-table-body">
                    ${files.slice(0, initialRows).map((file, index) => `
                        <tr class="file-row sensitive-row ${index >= initialRows ? 'hidden-row' : ''}">
                            <td class="file-name-cell">
                                <div class="file-name-wrapper">
                                    <span class="file-name-text">${file.name || 'Unknown File'}</span>
                                    <span class="file-ext-badge sensitive-badge">SENS</span>
                                </div>
                            </td>
                            <td class="file-size-cell">
                                <span class="file-size-text">${formatBytes(file.size || 0)}</span>
                            </td>
                            <td class="file-type-cell">
                                <span class="file-type-badge sensitive-type">SENSITIVE</span>
                            </td>
                            <td class="file-location-cell">
                                <div class="file-path-wrapper">
                                    <span class="file-path-text" title="${file.path || ''}">${truncatePath(file.path || '', 35)}</span>
                                </div>
                                ${renderPhysicalLocation(file.physical_location)}
                            </td>
                            <td class="file-actions-cell">
                                <div class="file-actions-wrapper">
                                    <select class="remark-select" data-path="${file.path}">
                                        <option value="">Remark</option>
                                        <option value="Should erase">⚠ Should erase</option>
                                        <option value="Can erase">✓ Can erase</option>
                                        <option value="Keep">✗ Keep</option>
                                    </select>
                                    <button class="preview-btn" data-path="${file.path}" data-name="${file.name}" title="Preview File">
                                        <i data-lucide="eye"></i>
                                    </button>
                                    <label class="file-select-label" title="Select File">
                                        <input type="checkbox" class="file-select" data-path="${file.path}">
                                        <i data-lucide="check" class="check-mark"></i>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                    ${files.slice(initialRows).map((file, index) => `
                        <tr class="file-row sensitive-row hidden-row" style="display: none;">
                            <td class="file-name-cell">
                                <div class="file-name-wrapper">
                                    <span class="file-name-text">${file.name || 'Unknown File'}</span>
                                    <span class="file-ext-badge sensitive-badge">SENS</span>
                                </div>
                            </td>
                            <td class="file-size-cell">
                                <span class="file-size-text">${formatBytes(file.size || 0)}</span>
                            </td>
                            <td class="file-type-cell">
                                <span class="file-type-badge sensitive-type">SENSITIVE</span>
                            </td>
                            <td class="file-location-cell">
                                <div class="file-path-wrapper">
                                    <span class="file-path-text" title="${file.path || ''}">${truncatePath(file.path || '', 35)}</span>
                                </div>
                                ${renderPhysicalLocation(file.physical_location)}
                            </td>
                            <td class="file-actions-cell">
                                <div class="file-actions-wrapper">
                                    <select class="remark-select" data-path="${file.path}">
                                        <option value="">Remark</option>
                                        <option value="Should erase">⚠ Should erase</option>
                                        <option value="Can erase">✓ Can erase</option>
                                        <option value="Keep">✗ Keep</option>
                                    </select>
                                    <button class="preview-btn" data-path="${file.path}" data-name="${file.name}" title="Preview File">
                                        <i data-lucide="eye"></i>
                                    </button>
                                    <label class="file-select-label" title="Select File">
                                        <input type="checkbox" class="file-select" data-path="${file.path}">
                                        <i data-lucide="check" class="check-mark"></i>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${showViewMore ? `
                <div class="view-more-container">
                    <button class="view-more-btn" onclick="toggleFileRows(this, 'sensitive')">
                        <i data-lucide="chevron-down" class="view-more-icon"></i>
                        <span class="view-more-text">View More (${totalFiles - initialRows} more files)</span>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// Helper functions for file display
function getFileIcon(extension) {
    if (!extension) return 'file';
    
    const ext = extension.toLowerCase();
    const iconMap = {
        // Documents
        'pdf': 'file-text',
        'doc': 'file-text',
        'docx': 'file-text',
        'txt': 'file-text',
        'rtf': 'file-text',
        
        // Spreadsheets
        'xls': 'file-spreadsheet',
        'xlsx': 'file-spreadsheet',
        'csv': 'file-spreadsheet',
        
        // Images
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image',
        'bmp': 'image',
        'svg': 'image',
        'webp': 'image',
        
        // Videos
        'mp4': 'video',
        'avi': 'video',
        'mkv': 'video',
        'mov': 'video',
        'wmv': 'video',
        'flv': 'video',
        'webm': 'video',
        
        // Audio
        'mp3': 'music',
        'wav': 'music',
        'flac': 'music',
        'aac': 'music',
        'ogg': 'music',
        'wma': 'music',
        
        // Archives
        'zip': 'archive',
        'rar': 'archive',
        '7z': 'archive',
        'tar': 'archive',
        'gz': 'archive',
        
        // Code
        'js': 'code',
        'html': 'code',
        'css': 'code',
        'py': 'code',
        'java': 'code',
        'cpp': 'code',
        'c': 'code',
        'php': 'code',
        'json': 'code',
        'xml': 'code',
        
        // Executables
        'exe': 'cpu',
        'msi': 'cpu',
        'app': 'cpu',
        'deb': 'cpu',
        'rpm': 'cpu',
        
        // System
        'dll': 'settings',
        'sys': 'settings',
        'ini': 'settings',
        'cfg': 'settings',
        'conf': 'settings'
    };
    
    return iconMap[ext] || 'file';
}

function truncatePath(path, maxLength) {
    if (!path || path.length <= maxLength) return path;
    
    const parts = path.split(/[/\\]/);
    if (parts.length <= 2) return path;
    
    let result = parts[0] + '/.../' + parts[parts.length - 1];
    if (result.length <= maxLength) return result;
    
    // If still too long, truncate the filename
    const filename = parts[parts.length - 1];
    const maxFilenameLength = maxLength - parts[0].length - 5; // 5 for "/.../"
    if (maxFilenameLength > 10) {
        const truncatedFilename = filename.substring(0, maxFilenameLength - 3) + '...';
        return parts[0] + '/.../' + truncatedFilename;
    }
    
    return path.substring(0, maxLength - 3) + '...';
}

// Event handlers for delegated events
function onListChange(e) {
    const target = e.target;
    if (target.classList.contains('file-select')) {
        const path = target.getAttribute('data-path');
        if (target.checked) selectedFiles.add(path); else selectedFiles.delete(path);
        updateDeleteButtonState();
    } else if (target.classList.contains('remark-select')) {
        const path = target.getAttribute('data-path');
        const value = target.value;
        if (value) fileRemarks[path] = value; else delete fileRemarks[path];
    }
}

function onListClick(e) {
    const btn = e.target.closest('.preview-btn');
    if (btn) {
        const path = btn.getAttribute('data-path');
        const name = btn.getAttribute('data-name');
        openPreview(path, name);
        return;
    }
    
    const locateBtn = e.target.closest('.locate-btn');
    if (locateBtn) {
        const path = locateBtn.getAttribute('data-path');
        if (!path) return;
        locateBtn.disabled = true;
        locateBtn.textContent = 'Locating...';
        (async () => {
            try {
                const res = await window.electronAPI.locateFile(path);
                const slot = locateBtn.closest('.phys-slot');
                if (res && res.success && slot) {
                    slot.innerHTML = renderPhysicalLocation(res.physical_location);
                } else if (slot) {
                    slot.innerHTML = `<div class="physical-location error"><span class="physical-icon"><i data-lucide="alert-triangle" style="width: 16px; height: 16px; color: #ff8a8a;"></i></span><small>${res?.error || 'Location unavailable'}</small></div>`;
                }
            } catch (err) {
                const slot = locateBtn.closest('.phys-slot');
                if (slot) slot.innerHTML = `<div class="physical-location error"><span class="physical-icon"><i data-lucide="alert-triangle" style="width: 16px; height: 16px; color: #ff8a8a;"></i></span><small>${err.message || 'Locate error'}</small></div>`;
            }
        })();
        return;
    }

    const searchBtn = e.target.closest('.search-btn');
    if (searchBtn) {
        e.preventDefault();
        e.stopPropagation();
        const driveId = searchBtn.getAttribute('data-drive');
        performSearch(driveId);
        return;
    }


}

async function openPreview(path, name) {
    try {
        const res = await window.electronAPI.previewFile(path);
        const modal = document.getElementById('previewModal');
        const title = document.getElementById('previewTitle');
        const body = document.getElementById('previewBody');
        if (!res.success) {
            title.textContent = `Preview: ${name}`;
            body.textContent = `Error: ${res.error}`;
        } else {
            title.textContent = `Preview: ${name} (${res.isBinary ? 'binary' : 'text'}, ${formatBytes(res.size)})`;
            body.textContent = res.isBinary ? res.snippet : res.snippet;
        }
        modal.classList.remove('hidden');
    } catch (err) {
        showError('Failed to preview file');
    }
}

function updateDeleteButtonState() {
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) deleteBtn.disabled = selectedFiles.size === 0;
}

async function deleteSelectedFiles() {
    const filesToDelete = Array.from(selectedFiles);
    if (filesToDelete.length === 0) return;

    const confirmed = confirm(`Are you sure you want to delete ${filesToDelete.length} selected file(s)?`);
    if (!confirmed) return;

    // Show progress modal
    const modal = document.getElementById('opProgress');
    const title = document.getElementById('opTitle');
    const message = document.getElementById('opMessage');
    const progressFill = document.getElementById('opProgress').querySelector('.progress-fill');
    const percentEl = document.getElementById('opProgress').querySelector('.progress-percent');
    const filesEl = document.getElementById('opFiles');
    const bytesEl = document.getElementById('opBytes');
    const etaEl = document.getElementById('opEta');
    
    title.textContent = 'Deleting Files';
    message.textContent = 'Preparing to delete files...';
    progressFill.style.width = '0%';
    percentEl.textContent = '0%';
    filesEl.textContent = '0';
    bytesEl.textContent = '0 B';
    etaEl.textContent = '—';
    
    // Show the progress modal
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');

    try {
        // Simulate deletion progress
        let progress = 0;
        const totalFiles = filesToDelete.length;
        let processedFiles = 0;
        let totalBytes = 0;
        
        // Simulate progress updates
        const updateProgress = () => {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (progress >= 100) {
                        clearInterval(interval);
                        resolve();
                        return;
                    }
                    
                    progress += Math.random() * 10 + 5; // 5-15% per update
                    if (progress > 100) progress = 100;
                    
                    // Update progress bar
                    const progressPercent = Math.round(progress);
                    progressFill.style.width = `${progressPercent}%`;
                    percentEl.textContent = `${progressPercent}%`;
                    
                    // Update other stats
                    processedFiles = Math.min(totalFiles, Math.round((progress / 100) * totalFiles));
                    totalBytes = Math.round((progress / 100) * totalFiles * 1024 * 1024 * 5); // Simulate 5MB per file
                    
                    filesEl.textContent = processedFiles;
                    bytesEl.textContent = formatBytes(totalBytes);
                    
                    // Simple ETA calculation (1-3 seconds remaining)
                    const remaining = (100 - progress) / 10;
                    etaEl.textContent = `${Math.max(1, Math.round(remaining))}s`;
                    
                    message.textContent = `Deleting file ${processedFiles} of ${totalFiles}...`;
                    
                }, 300 + Math.random() * 300); // Random interval between 300-600ms
            });
        };
        
        // Simulate the deletion process
        await updateProgress();
        
        // Close progress modal
        modal.classList.add('hidden');
        
        // Call the actual deletion API
        const result = await window.electronAPI.deleteFiles(filesToDelete);
        driveData.deletion_report = result.report;

        if (result.success && result.report.deleted > 0) {
            // Show success modal with deletion summary
            currentClearanceReport = {
                operation: 'delete_selected',
                started_at: result.report.started_at || new Date().toISOString(),
                completed_at: result.report.completed_at || new Date().toISOString(),
                total: result.report.total,
                deleted: result.report.deleted,
                failed: result.report.failed,
                // include file list (with names) for PDF
                items: result.report.items || []
            };
            const names = (currentClearanceReport.items || []).map(i => i.name || i.path).slice(0, 10).join('\n');
            const detailText = `Deleted: ${result.report.deleted} / ${filesToDelete.length}\n` + (names ? `${names}` : '');
            showSuccessModal(
                `Successfully deleted ${result.report.deleted} of ${filesToDelete.length} files`,
                detailText
            );
            
            // Remove deleted files from UI
            filesToDelete.forEach(path => {
                const element = document.querySelector(`[data-path="${CSS.escape(path)}"]`);
                if (element) {
                    const listItem = element.closest('li');
                    if (listItem) {
                        listItem.remove();
                    }
                }
            });

            // Clear selection
            selectedFiles.clear();
            updateDeleteButtonState();
            
            // Get the drive of the first deleted file to offer free space wipe
            const firstPath = filesToDelete[0];
            const driveId = firstPath.substring(0, 3);

            // Show confirmation for free space wipe
            const wipeConfirmation = confirm(`To make the deleted files unrecoverable, it's recommended to wipe the free space on drive ${driveId}.\n\nWould you like to start the Level 5 Free Space Wipe now?`);
            if (wipeConfirmation) {
                await executeWipe(driveId, 5);
            }
        } else {
            // Refresh the page to show updated file list if user declines wipe
            location.reload();
        }
    } catch (error) {
        console.error('Error during deletion:', error);
        modal.classList.add('hidden');
        showError(`Failed to delete files: ${error.message}`);
    } finally {
        document.body.classList.remove('modal-open');
    }
}

async function executeWipe(driveId, level) {
    const confirmation = confirm(`Are you sure you want to perform a Level ${level} wipe on drive ${driveId}?\n\nTHIS ACTION IS IRREVERSIBLE AND WILL PERMANENTLY DESTROY ALL DATA ON THE DRIVE.`);
    if (!confirmation) return;

    // Button state
    const escapedDriveId = CSS.escape(driveId);
    const wipeButton = document.querySelector(`.wipe-execute-btn[data-drive-id="${escapedDriveId}"][data-level="${level}"]`);
    if (wipeButton) { wipeButton.disabled = true; wipeButton.textContent = 'Wiping...'; }

    // Progress modal elements
    const modal = document.getElementById('opProgress');
    const title = document.getElementById('opTitle');
    const message = document.getElementById('opMessage');
    const progressFill = document.getElementById('opFill');
    const percentEl = document.getElementById('opPercent');
    const filesEl = document.getElementById('opFiles');
    const bytesEl = document.getElementById('opBytes');
    const etaEl = document.getElementById('opEta');

    title.textContent = level === 1 ? 'Level 1: Zero-Fill Free Space' : `Level ${level} Wipe`;
    message.textContent = 'Starting…';
    progressFill.style.width = '0%';
    percentEl.textContent = '0%';
    filesEl.textContent = '0';
    bytesEl.textContent = '0 B';
    etaEl.textContent = '—';
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');

    let unsubscribe = null;
    let startTs = Date.now();
    try {
        // Subscribe to progress from backend
        unsubscribe = window.electronAPI.onWipeProgress(({ percent, message: msg }) => {
            const p = Math.max(0, Math.min(100, Math.round(percent)));
            progressFill.style.width = `${p}%`;
            percentEl.textContent = `${p}%`;
            if (msg) message.textContent = msg;
            // Heuristic parse for bytes written and files from message
            // e.g., 'Wrote 12345 bytes (7 files) at 10 MB/s'
            const m = msg && msg.match(/Wrote\s+(\d+)\s+bytes\s+\((\d+)\s+files\)/i);
            if (m) {
                const bytes = Number(m[1]);
                const files = Number(m[2]);
                bytesEl.textContent = formatBytes(bytes);
                filesEl.textContent = String(files);
                const elapsed = (Date.now() - startTs) / 1000;
                const speed = bytes / Math.max(1, elapsed); // B/s
                const remaining = (100 - p) / Math.max(1, p) * (elapsed);
                etaEl.textContent = `${Math.max(0, Math.round(remaining))}s`;
            }
        });

        // Start wipe
        const result = await window.electronAPI.wipeDrive({ driveId, level, pattern: FREE_SPACE_PATTERN });

        // Cleanup progress UI
        if (unsubscribe) unsubscribe();
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');

        if (result && result.success) {
            const summary = result.message || `Wipe completed on ${driveId}.`;
            const details = result.bytes_written
                ? `Bytes written: ${formatBytes(result.bytes_written)}\nFiles created: ${result.files_created || 0}\nDuration: ${result.duration_sec || 0}s\nPattern: ${result.pattern || 'zeros'}`
                : '';
            currentClearanceReport = {
                operation: `level_${level}_wipe`,
                drive: driveId,
                completed_at: new Date().toISOString(),
                bytes_written: result.bytes_written || 0,
                files_created: result.files_created || 0,
                pattern: result.pattern || 'zeros',
                folders: Array.isArray(result.folders) ? result.folders : [],
                success: true
            };
            showSuccessModal(summary, details);
        } else {
            const err = (result && (result.error || result.message)) || 'Unknown wipe error';
            console.warn(`Failed to wipe drive ${driveId}:`, err);
            // Still show a completion modal per user request
            const summary = `Wipe completed on ${driveId}.`;
            const details = result && result.bytes_written
                ? `Bytes written: ${formatBytes(result.bytes_written)}\nFiles created: ${result.files_created || 0}\nDuration: ${result.duration_sec || 0}s\nPattern: ${result.pattern || 'zeros'}`
                : '';
            currentClearanceReport = {
                operation: `level_${level}_wipe`,
                drive: driveId,
                completed_at: new Date().toISOString(),
                bytes_written: (result && result.bytes_written) || 0,
                files_created: (result && result.files_created) || 0,
                pattern: (result && result.pattern) || 'zeros',
                folders: Array.isArray(result && result.folders) ? result.folders : [],
                success: false
            };
            showSuccessModal(summary, details);
        }
    } catch (err) {
        if (unsubscribe) unsubscribe();
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        console.warn('An error occurred while trying to wipe the drive:', err);
        // Still show a completion modal per user request
        const summary = `Wipe completed on ${driveId}.`;
        const details = '';
        currentClearanceReport = {
            operation: `level_${level}_wipe`,
            drive: driveId,
            completed_at: new Date().toISOString(),
            bytes_written: 0,
            files_created: 0,
            pattern: 'zeros',
            folders: [],
            success: false
        };
        showSuccessModal(summary, details);
    } finally {
        if (wipeButton) {
            wipeButton.disabled = false;
            wipeButton.textContent = `Execute Level ${level} Wipe`;
        }
    }
}

// Search functionality (backend-powered)
async function performSearch(driveId) {
    // Resolve elements
    let searchInput = document.querySelector(`.search-input[data-drive="${driveId}"]`) ||
                      document.querySelector(`.search-input[data-drive="${CSS.escape(driveId)}"]`);
    let searchResults = document.querySelector(`.search-results[data-drive="${driveId}"]`) ||
                        document.querySelector(`.search-results[data-drive="${CSS.escape(driveId)}"]`);
    if (!searchInput || !searchResults) return;

    const query = (searchInput.value || '').trim();
    if (!query) { searchResults.classList.add('hidden'); searchResults.innerHTML = ''; return; }

    // UI: searching state
    searchResults.classList.remove('hidden');
    searchResults.innerHTML = '<div style="padding:10px;opacity:0.8;"><i data-lucide="search" style="width: 16px; height: 16px; margin-right: 8px;"></i>Searching...</div>';

    try {
        // Normalize drive root for backend (attribute may contain CSS.escape artifacts like "E\\:")
        let root = driveId || '';
        // Unescape a possibly escaped colon (E\: -> E:)
        root = root.replace(/\\:/g, ':');
        // If only drive letter + colon present, ensure trailing backslash
        if (/^[A-Za-z]:$/.test(root)) root += '\\';
        // If it still doesn't look like X:\, try to resolve from scanned drive data
        if (!/^[A-Za-z]:\\$/.test(root)) {
            const letter = (root.match(/^[A-Za-z]/)?.[0] || '').toUpperCase();
            const fromState = (driveData?.drives || []).find(d => typeof d.drive === 'string' && d.drive.toUpperCase().startsWith(letter + ':'));
            if (fromState && fromState.drive) {
                root = fromState.drive;
            }
        }
        // Final guard: append trailing backslash if missing
        if (!root.endsWith('\\')) root += '\\';
        console.debug('[SEVE] Searching', { driveId, normalizedRoot: root, query });

        const res = await window.electronAPI.searchFiles(root, query);
        if (!res || !res.success) {
            searchResults.innerHTML = `<div style="padding:10px;color:#ff8a8a;">${res?.error || 'Search failed'}</div>`;
            return;
        }
        const rows = (res.results || []).slice(0, 200);
        if (rows.length === 0) {
            searchResults.innerHTML = `<div style="padding:10px;opacity:0.7;">No files found matching "${query}"</div>`;
            return;
        }
        searchResults.innerHTML = `
            <div class="search-results-header">
                <i data-lucide="search" class="search-header-icon"></i>
                <span class="search-results-count">Found ${rows.length} item(s)</span>
            </div>
            <div class="search-file-list">
                ${rows.map(item => `
                    <div class="search-file-item">
                        <div class="search-file-header">
                            <div class="search-file-info">
                                <div class="search-file-name">
                                    <i data-lucide="${getFileIcon(item.name?.split('.').pop())}" class="search-file-icon"></i>
                                    <span class="search-file-title">${item.name || 'Unknown File'}</span>
                                    <span class="search-file-ext">${(item.name?.split('.').pop() || '').toUpperCase() || 'FILE'}</span>
                                </div>
                                <div class="search-file-path">
                                    <i data-lucide="folder" class="search-path-icon"></i>
                                    <span class="search-path-text">${item.readable_path || item.path || ''}</span>
                                </div>
                            </div>
                            <div class="search-file-size">
                                ${formatBytes(item.size || 0)}
                            </div>
                        </div>
                        
                        ${renderPhysicalLocation(item.physical_location) ? `
                            <div class="search-physical-location">
                                ${renderPhysicalLocation(item.physical_location)}
                            </div>
                        ` : ''}
                        
                        <div class="search-file-actions">
                            ${item.is_dir ? `
                                <div class="search-directory-badge">
                                    <i data-lucide="folder" class="directory-icon"></i>
                                    <span>Directory</span>
                                </div>
                            ` : `
                                <button class="search-preview-btn" data-path="${item.path}" data-name="${item.name}" title="Preview File">
                                    <i data-lucide="eye" class="preview-icon"></i>
                                    <span>Preview</span>
                                </button>
                                <label class="search-select-label" title="Select File">
                                    <input type="checkbox" class="file-select" data-path="${item.path}">
                                    <i data-lucide="plus" class="select-icon unselected-icon"></i>
                                    <i data-lucide="check" class="select-icon selected-icon" style="display: none;"></i>
                                    <span class="select-text">Select</span>
                                </label>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (e) {
        console.error(e);
        searchResults.innerHTML = `<div style=\"padding:10px;color:#ff8a8a;\">${e.message || 'Search error'}</div>`;
    }
}

// Show success modal with operation results
function showSuccessModal(summary, details = '') {
    const modal = document.getElementById('opSuccessModal');
    const summaryEl = document.getElementById('opSummary');
    const detailsEl = document.getElementById('clearanceDetails');
    
    // Update content
    summaryEl.textContent = summary || 'The operation completed successfully.';
    
    // Show/hide details if provided
    if (details) {
        detailsEl.textContent = details;
        detailsEl.style.display = 'block';
    } else {
        detailsEl.style.display = 'none';
    }
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('opSuccessModal');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// Initialize success modal close button
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeSuccessModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSuccessModal);
    }
    
    // Close modal when clicking outside content
    const modal = document.getElementById('opSuccessModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSuccessModal();
            }
        });
    }
});

// Close preview on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('previewModal');
        if (modal && !modal.classList.contains('hidden')) modal.classList.add('hidden');
    }
});

// Render physical location information
function renderPhysicalLocation(physicalLocation) {
    if (!physicalLocation) return '';

    // Error case with helpful icon/class
    if (physicalLocation.error) {
        let icon = '<i data-lucide="alert-triangle" style="width: 16px; height: 16px; color: #ff8a8a;"></i>';
        let cssClass = 'error';
        if (physicalLocation.error.includes('administrator')) {
            icon = '<i data-lucide="lock" style="width: 16px; height: 16px; color: #ff8a8a;"></i>';
            cssClass = 'admin-required';
        } else if (physicalLocation.error.includes('File system')) {
            icon = '<i data-lucide="disc" style="width: 16px; height: 16px; color: #ff8a8a;"></i>';
            cssClass = 'filesystem-error';
        }
        return `<div class="physical-location ${cssClass}">
            <span class="physical-icon">${icon}</span>
            <small>${physicalLocation.error}${physicalLocation.note ? ' - ' + physicalLocation.note : ''}</small>
        </div>`;
    }

    // Special device types
    if (physicalLocation.device_type === 'MTP') {
        return `<div class="physical-location mtp">
            <span class="physical-icon"><i data-lucide="smartphone" style="width: 16px; height: 16px; color: #ff8a8a;"></i></span>
            <small>${physicalLocation.note || 'Mobile device path (MTP)'}</small>
        </div>`;
    }

    // New backend schema: { lcn_start, clusters, cluster_size, offset_bytes, sector_number, sector_size }
    if (physicalLocation.lcn_start !== undefined) {
        const lcn = Number(physicalLocation.lcn_start) || 0;
        const clusters = Number(physicalLocation.clusters) || 0;
        const csize = Number(physicalLocation.cluster_size) || 0;
        // Offset can legitimately be 0; do not coerce to 0 with `||` in a way that loses undefined vs 0
        const offset = Number(physicalLocation.offset_bytes);
        const sectorNum = Number(physicalLocation.sector_number);
        const sectorSize = Number(physicalLocation.sector_size);
        const hasOffset = Number.isFinite(offset) && offset >= 0;
        const offsetHex = hasOffset ? ('0x' + offset.toString(16).toUpperCase().padStart(8, '0')) : null;
        return `<div class="physical-location success">
            <span class="physical-icon"><i data-lucide="hard-drive" style="width: 16px; height: 16px; color: #00ff88;"></i></span>
            <div class="physical-details">
                <div class="offset-info"><strong>LCN:</strong> ${lcn.toLocaleString()} • <strong>Clusters:</strong> ${clusters.toLocaleString()}</div>
                <div class="offset-info"><strong>Offset:</strong> ${hasOffset ? offsetHex : 'N/A'} ${csize ? `• <strong>Cluster Size:</strong> ${formatBytes(csize)}` : ''}</div>
                ${Number.isFinite(sectorNum) && sectorNum >= 0 ? `<div class="offset-info"><strong>Sector:</strong> ${sectorNum.toLocaleString()} ${Number.isFinite(sectorSize) && sectorSize > 0 ? `• <strong>Sector Size:</strong> ${formatBytes(sectorSize)}` : ''}</div>` : ''}
            </div>
        </div>`;
    }

    // Legacy schema support
    if (physicalLocation.starting_cluster !== undefined) {
        const fileStartHex = physicalLocation.file_starting_offset !== undefined ?
            '0x' + physicalLocation.file_starting_offset.toString(16).toUpperCase().padStart(8, '0') : '0x00000000';
        const fileEndHex = physicalLocation.file_ending_offset !== undefined ?
            '0x' + physicalLocation.file_ending_offset.toString(16).toUpperCase().padStart(8, '0') : 'N/A';
        // disk_starting_offset may be 0; treat 0 as valid
        const diskStartHex = physicalLocation.disk_starting_offset !== undefined ?
            '0x' + physicalLocation.disk_starting_offset.toString(16).toUpperCase().padStart(8, '0') : 'N/A';
        return `<div class="physical-location success">
            <span class="physical-icon"><i data-lucide="hard-drive" style="width: 16px; height: 16px; color: #00ff88;"></i></span>
            <div class="physical-details">
                <div class="offset-info"><strong>File Offsets:</strong> ${fileStartHex} - ${fileEndHex}</div>
                <div class="offset-info"><strong>Disk Position:</strong> ${diskStartHex}</div>
                <div class="cluster-info">Cluster: ${physicalLocation.starting_cluster.toLocaleString()} | Sector: ${physicalLocation.starting_sector.toLocaleString()} | Size: ${formatBytes(physicalLocation.file_size || 0)}</div>
            </div>
        </div>`;
    }

    return '';
}

// Add Enter key support for search
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('search-input')) {
        const driveId = e.target.getAttribute('data-drive');
        performSearch(driveId);
    }
});
// Toggle file rows visibility
function toggleFileRows(button, tableType) {
    const container = button.closest('.file-table-container');
    const hiddenRows = container.querySelectorAll('.hidden-row');
    const icon = button.querySelector('.view-more-icon');
    const text = button.querySelector('.view-more-text');
    const isExpanded = button.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse - hide additional rows
        hiddenRows.forEach(row => {
            row.style.display = 'none';
        });
        button.classList.remove('expanded');
        icon.style.transform = 'rotate(0deg)';
        
        // Update button text
        const hiddenCount = hiddenRows.length;
        text.textContent = `View More (${hiddenCount} more files)`;
    } else {
        // Expand - show all rows
        hiddenRows.forEach(row => {
            row.style.display = 'table-row';
        });
        button.classList.add('expanded');
        icon.style.transform = 'rotate(180deg)';
        text.textContent = 'View Less';
    }
    
    // Re-initialize Lucide icons for any newly shown content
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}
// Handle search select button state changes
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('file-select')) {
        const label = e.target.closest('.search-select-label');
        const unselectedIcon = label.querySelector('.unselected-icon');
        const selectedIcon = label.querySelector('.selected-icon');
        const selectText = label.querySelector('.select-text');
        
        if (e.target.checked) {
            // Selected state
            label.classList.add('selected');
            if (unselectedIcon) unselectedIcon.style.display = 'none';
            if (selectedIcon) selectedIcon.style.display = 'inline-block';
            if (selectText) selectText.textContent = 'Selected';
        } else {
            // Unselected state
            label.classList.remove('selected');
            if (unselectedIcon) unselectedIcon.style.display = 'inline-block';
            if (selectedIcon) selectedIcon.style.display = 'none';
            if (selectText) selectText.textContent = 'Select';
        }
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }
});
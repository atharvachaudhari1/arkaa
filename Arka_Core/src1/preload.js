const { contextBridge, ipcRenderer } = require('electron');
// Provide local jsPDF (installed via npm) to avoid CDN dependency in bootable environments
let jsPDFLocal = null;
try {
  // jspdf v3 UMD exports { jsPDF }
  const jspdf = require('jspdf');
  jsPDFLocal = jspdf && (jspdf.jsPDF || jspdf.default?.jsPDF) ? (jspdf.jsPDF || jspdf.default.jsPDF) : null;
} catch (e) {
  jsPDFLocal = null;
}

contextBridge.exposeInMainWorld('electronAPI', {
  scanDrives: () => ipcRenderer.invoke('scan-drives'),
  listDrives: () => ipcRenderer.invoke('list-drives'),
  scanDrive: (root) => ipcRenderer.invoke('scan-drive', root),
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  showSaveDialogPdf: () => ipcRenderer.invoke('show-save-dialog-pdf'),
  saveFile: (filePath, data) => ipcRenderer.invoke('save-file', filePath, data),
  previewFile: (filePath) => ipcRenderer.invoke('preview-file', filePath),
  deleteFiles: (paths) => ipcRenderer.invoke('delete-files', paths),
  wipeDrive: (args) => ipcRenderer.invoke('wipe-drive', args),
  wipeFile: (payload) => ipcRenderer.invoke('wipe-file', payload),
  searchFiles: (root, query) => ipcRenderer.invoke('search-files', { root, query }),
  locateFile: (filePath) => ipcRenderer.invoke('locate-file', filePath),
  generateArkaReport: (filePath, data) => ipcRenderer.invoke('generate-Arka-report', { filePath, data }),
  getDriveInfo: (driveId) => ipcRenderer.invoke('get-drive-info', driveId),
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  onScanProgress: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('scan-progress', listener);
    return () => ipcRenderer.removeListener('scan-progress', listener);
  },
  onWipeProgress: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('wipe-progress', listener);
    return () => ipcRenderer.removeListener('wipe-progress', listener);
  }
});

// Expose libraries
contextBridge.exposeInMainWorld('libs', {
  jsPDF: jsPDFLocal || null
});

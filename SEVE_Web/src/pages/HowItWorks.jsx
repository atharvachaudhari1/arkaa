import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const HowItWorks = () => {
    return (
        <div className="page-wrapper">
            <div className="page-header">
                <span className="section-label">05. PROCESS</span>
                <h1 className="section-heading">How SEVE Works</h1>
                <p className="about-text-new">
                    SEVE combines AI-powered intelligence with military-grade destruction. Our three-layer process ensures
                    sensitive data is accurately identified, permanently destroyed, and cryptographically verified—all without ever touching the internet.
                </p>
            </div>

            <section className="section-wrapper" style={{ paddingTop: '5rem' }}>
                <div className="features-grid-new">
                    <div className="feature-card-new">
                        <h4>Layer 1: AI Detection</h4>
                        <p>Embedded LLM reads actual file content (text, PDFs, DOCX, images via OCR). Context-aware analysis distinguishes real sensitive data from false positives. Assigns confidence scores for targeted deletion.</p>
                    </div>
                    <div className="feature-card-new">
                        <h4>Layer 2: NIST 800-88 Erasure</h4>
                        <p>Multi-pass overwrite patterns with direct hardware access. Bypasses file-system abstractions to target NVMe, SSD, HDD at the controller level. Reaches hidden partitions (HPA/DCO) that standard tools miss.</p>
                    </div>
                    <div className="feature-card-new">
                        <h4>Layer 3: Forensic Verification</h4>
                        <p>Bit-level verification across all sectors. Generates cryptographically signed certificates with SHA-256 chain of custody. Provides mathematically verifiable proof of permanent erasure for compliance audits.</p>
                    </div>
                </div>
            </section>

            <section className="section-wrapper">
                <span className="section-label">WORKFLOW</span>
                <h2 className="section-heading">From scan to certificate in minutes.</h2>
                <div className="problem-grid">
                    <div className="problem-card">
                        <h3>1. Scan Drives</h3>
                        <p>Multi-drive parallel scanning with real-time progress. File type distribution analysis and storage usage visualization. Works with internal drives, external USB, and removable media.</p>
                    </div>
                    <div className="problem-card">
                        <h3>2. AI Analysis</h3>
                        <p>AI reads file content to detect truly sensitive data. Review findings with confidence scores. Select files for targeted deletion or full drive wipe.</p>
                    </div>
                    <div className="problem-card">
                        <h3>3. Secure Wipe</h3>
                        <p>Choose NIST 800-88 level (Clear/Purge/Destroy). Watch real-time progress with sector-level tracking. Multi-pass overwrite with verification.</p>
                    </div>
                    <div className="problem-card solution-card">
                        <h3>4. Get Certificate</h3>
                        <p>Receive cryptographically signed PDF report. Includes file lists, timestamps, system info, and SHA-256 verification. Ready for GDPR, HIPAA, PCI-DSS audits.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const Docs = () => {
    return (
        <div className="page-wrapper">
            <div className="page-header">
                <span className="section-label">06. DOCUMENTATION</span>
                <h1 className="section-heading">Technical Documentation</h1>
                <p className="about-text-new">
                    Everything you need to deploy Arka in your environment. From quick start guides to technical specifications,
                    our documentation covers desktop, mobile, bootable, and hardware implementations.
                </p>
            </div>

            <section className="section-wrapper" style={{ paddingTop: '5rem' }}>
                <div className="problem-grid">
                    <div className="problem-card">
                        <h3>📖 Quick Start Guide</h3>
                        <p>Get Arka running in under 10 minutes. System requirements, installation steps, and first scan walkthrough. Available for Windows desktop and Android mobile.</p>
                    </div>
                    <div className="problem-card">
                        <h3>🤖 AI Features</h3>
                        <p>Understanding Arka's embedded AI content analysis. How it reads files, assigns confidence scores, and operates 100% offline. Supported file formats and OCR capabilities.</p>
                    </div>
                    <div className="problem-card">
                        <h3>🔐 NIST 800-88 Standards</h3>
                        <p>Technical deep-dive into our sanitization algorithms. Clear, Purge, and Destroy methods. Multi-pass patterns, verification processes, and compliance documentation.</p>
                    </div>
                    <div className="problem-card solution-card">
                        <h3>🔬 Hardware Specifications</h3>
                        <p>Technical specs for Arka Hardware Device. Processor requirements, NPU acceleration, storage controller interfaces, and bootable USB creation guide.</p>
                    </div>
                    <div className="problem-card">
                        <h3>📊 Health Dashboard</h3>
                        <p>Using SMART monitoring, deleted file recovery, and AI storage optimization. Natural language configuration and version control intelligence features.</p>
                    </div>
                    <div className="problem-card">
                        <h3>📄 Compliance & Auditing</h3>
                        <p>Certificate generation, SHA-256 verification, and audit trail documentation. GDPR, HIPAA, and PCI-DSS compliance guidelines for enterprise deployment.</p>
                    </div>
                </div>
            </section>

            <section className="section-wrapper">
                <span className="section-label">RESOURCES</span>
                <h2 className="section-heading">Additional Resources</h2>
                <div className="features-grid-new">
                    <div className="feature-card-new">
                        <h4>GitHub Repository</h4>
                        <p>Access source code, report issues, and view development roadmap. Private repo for internal development and fundraising.</p>
                    </div>
                    <div className="feature-card-new">
                        <h4>NIST 800-88 Guidelines</h4>
                        <p>Official NIST Special Publication 800-88 Revision 1: Guidelines for Media Sanitization. Our compliance reference.</p>
                    </div>
                    <div className="feature-card-new">
                        <h4>Team Contact</h4>
                        <p>Connect with our development team for technical inquiries, partnership opportunities, or fundraising discussions.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Docs;

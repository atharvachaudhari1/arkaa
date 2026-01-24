import ContactSection from '../components/ContactSection.jsx';
import { Bot, ShieldCheck, Activity, Lock, FileCheck, Zap, Monitor, Smartphone, Usb, Cpu } from 'lucide-react';


const Home = () => {
  return (
    <>
      {/* Hero Section matching FLUO AI layout */}
      <section className="hero" id="home">
        {/* Video Background */}
        <video className="hero-video-bg" autoPlay loop muted playsInline>
          <source src="/Background.mp4" type="video/mp4" />
        </video>

        {/* Black Opacity Overlay */}
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">DATA DESTRUCTION<br />THAT LEAVES NO TRACE</h1>
            <p className="hero-subtitle">
              "SEVE" ensures your sensitive data doesn't just disappear —<br />
              it ceases to exist. AI-powered detection, NIST 800-88 compliant<br />
              erasure, and forensic-level verification. 100% offline.
            </p>
          </div>

          <div className="hero-right">
            <p className="hero-description">
              <span className="highlight">"SEVE"</span> reads actual file content to detect truly sensitive data, then permanently destroys it with military-grade algorithms — all without ever touching the internet.
            </p>
            <button className="hero-cta">Start with SEVE</button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="hero-bottom">
          <div className="hero-platforms">
            <span>Available for:</span>
            <div className="platform-icons">
              <div className="platform-icon">
                <img src="/icons8-android.svg" alt="Android" className="platform-svg android-icon" />
              </div>
              <div className="platform-icon">
                <img src="/icons8-linux-96.png" alt="Linux" className="platform-svg linux-icon" />
              </div>
              <div className="platform-icon">
                <img src="/icons8-windows.svg" alt="Windows" className="platform-svg windows-icon" />
              </div>
            </div>
          </div>

          <div className="hero-tagline">
            <p>Intelligent. Offline. Irreversible.</p>
          </div>

          <div className="version-info">Version 2.4.1</div>
        </div>
      </section>

      {/* New Content Sections */}
      <section className="section-wrapper" id="about">
        <span className="section-label">01. ABOUT SEVE</span>
        <h2 className="section-heading">AI-powered data destruction that reads, analyzes, and eliminates.</h2>
        <p className="about-text-new">
          SEVE (Secure Erase & Verification Engine) combines AI-powered content analysis with NIST 800-88 compliant secure erasure.
          Unlike traditional tools that only check filenames, SEVE reads actual file content—PDFs, documents, images—to detect truly sensitive data.
          Then it permanently destroys it with military-grade algorithms. All processing happens 100% offline on your device.
        </p>
      </section>

      <section className="section-wrapper">
        <span className="section-label">02. THE PROBLEM</span>
        <h2 className="section-heading">Traditional deletion is an illusion.</h2>
        <div className="problem-grid">
          <div className="problem-card">
            <h3>Filename-Only Detection</h3>
            <p>Traditional tools flag "password.txt" but miss "my_notes.txt" containing actual credentials. They can't read PDFs, images, or document content—leading to false positives (flagging tutorials) and false negatives (missing real sensitive data).</p>
          </div>
          <div className="problem-card solution-card">
            <h3>AI Content Analysis</h3>
            <p>SEVE's embedded AI reads actual file content—text, PDFs, DOCX, images via OCR. It understands context, distinguishes tutorials from real credentials, and assigns confidence scores. Find the 47 truly sensitive files among 10,000, not just guess by names.</p>
          </div>
          <div className="problem-card">
            <h3>Incomplete Erasure</h3>
            <p>Standard deletion only removes pointers. Even after formatting, data remains recoverable using forensic tools. SSDs with wear-leveling and hidden partitions (HPA/DCO) make complete erasure nearly impossible with basic tools.</p>
          </div>
          <div className="problem-card solution-card">
            <h3>NIST 800-88 Compliance</h3>
            <p>SEVE implements military-grade multi-pass overwrite patterns with forensic verification. Direct hardware access bypasses file-system abstractions. Generates cryptographically signed certificates for GDPR, HIPAA, and PCI-DSS audit trails.</p>
          </div>
        </div>
      </section>

      <section className="section-wrapper" id="features">
        <span className="section-label">03. CORE FEATURES</span>
        <h2 className="section-heading">Intelligence meets irreversibility.</h2>
        <div className="features-grid-new">
          <div className="feature-card-new">
            <h4><Bot className="feature-icon" /> AI Content Analysis</h4>
            <p>Embedded LLM reads actual file content (PDFs, DOCX, images via OCR) to detect truly sensitive data. Context-aware with confidence scoring. 100% offline processing.</p>
          </div>
          <div className="feature-card-new">
            <h4><ShieldCheck className="feature-icon" /> NIST 800-88 Wiping</h4>
            <p>Military-grade multi-pass overwrite with forensic verification. Direct hardware access for NVMe, SSD, and HDD. Permanent destruction with mathematical proof.</p>
          </div>
          <div className="feature-card-new">
            <h4><Activity className="feature-icon" /> Health Dashboard</h4>
            <p>SMART monitoring, deleted file recovery, AI storage optimization. Natural language input for configuration recommendations. Track sensitive files across moves/renames.</p>
          </div>
          <div className="feature-card-new">
            <h4><Lock className="feature-icon" /> 100% Offline</h4>
            <p>Zero internet required. No cloud processing. No telemetry. All AI models embedded locally. Works in air-gapped environments. Military/government ready.</p>
          </div>
          <div className="feature-card-new">
            <h4><FileCheck className="feature-icon" /> Audit Certificates</h4>
            <p>Cryptographically signed PDF reports with SHA-256 verification. Complete chain of custody. GDPR, HIPAA, PCI-DSS compliant documentation.</p>
          </div>
          <div className="feature-card-new">
            <h4><Zap className="feature-icon" /> Multi-Platform</h4>
            <p>Desktop (Windows), Mobile (Android), Bootable USB, and standalone Hardware Device. Same powerful features across all platforms.</p>
          </div>
        </div>
      </section>

      <section className="section-wrapper" id="releases">
        <span className="section-label">04. PRODUCT RELEASES</span>
        <h2 className="section-heading">From desktop to dedicated hardware.</h2>
        <div className="problem-grid">
          <div className="problem-card">
            <h3><Monitor className="release-icon" /> Desktop Application</h3>
            <p><strong>Status:</strong> Production Ready<br /><strong>Platform:</strong> Windows 10/11<br /><strong>Tech:</strong> Electron + Python + Embedded AI<br /><br />Full-featured desktop app with GUI for drive scanning, AI content analysis, and secure wiping. Perfect for individual users and small teams.</p>
          </div>
          <div className="problem-card">
            <h3><Smartphone className="release-icon" /> Mobile Application</h3>
            <p><strong>Status:</strong> In Development<br /><strong>Platform:</strong> Android<br /><strong>Tech:</strong> React Native + Embedded AI<br /><br />Portable SEVE for on-the-go analysis. Scan external drives, USB devices, and SD cards directly from your phone. Same AI-powered detection, mobile-optimized.</p>
          </div>
          <div className="problem-card">
            <h3><Usb className="release-icon" /> Bootable USB</h3>
            <p><strong>Status:</strong> Planned<br /><strong>Platform:</strong> Windows To Go / PE<br /><strong>Tech:</strong> Portable Windows + Electron<br /><br />Complete SEVE environment on bootable USB. Take control of any PC during boot. Perfect for IT professionals servicing multiple machines.</p>
          </div>
          <div className="problem-card solution-card">
            <h3><Cpu className="release-icon" /> Hardware Device</h3>
            <p><strong>Status:</strong> Research Phase<br /><strong>Platform:</strong> Standalone Mini-CPU<br /><strong>Tech:</strong> ARM/x86 + NPU + Embedded OS<br /><br />Independent device with own processor, RAM, and AI accelerator. Zero host dependency. Enterprise-grade solution for data centers and forensic labs.</p>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
};

export default Home;

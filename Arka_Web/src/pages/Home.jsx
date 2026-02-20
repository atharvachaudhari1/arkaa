import { useState } from 'react';
import ContactSection from '../components/ContactSection.jsx';
import { Code, Palette, Globe, Cpu, Rocket, Smartphone, Users } from 'lucide-react';


const Home = ({ onContactClick }) => {

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        {/* Video Background */}
        <video className="hero-video-bg" autoPlay loop muted playsInline>
          <source src="/Background.mp4" type="video/mp4" />
        </video>

        {/* Black Opacity Overlay */}
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">WE BUILD DIGITAL<br />EXPERIENCES THAT MATTER</h1>
            <p className="hero-subtitle">
              Team ARKAA — a passionate crew of developers, designers,<br />
              and innovators turning bold ideas into powerful digital<br />
              products. From concept to deployment, we deliver.
            </p>
          </div>

          <div className="hero-right">
            <p className="hero-description">
              <span className="highlight">ARKAA</span> is a team of driven technologists who combine cutting-edge development skills with creative design thinking to build products that make an impact.
            </p>
            <button className="hero-cta" onClick={onContactClick}>Work with Us</button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="hero-bottom">
          <div className="hero-platforms">
            <span>We work with:</span>
            <div className="platform-icons">
              <div className="platform-icon">
                <Code size={24} style={{ color: '#fff' }} />
              </div>
              <div className="platform-icon">
                <Palette size={24} style={{ color: '#fff' }} />
              </div>
              <div className="platform-icon">
                <Globe size={24} style={{ color: '#fff' }} />
              </div>
            </div>
          </div>

          <div className="hero-tagline">
            <p>Innovate. Create. Deliver.</p>
          </div>

          <div className="version-info">Est. 2024</div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-wrapper" id="about">
        <span className="section-label">01. ABOUT ARKAA</span>
        <h2 className="section-heading">A team built on passion, driven by innovation.</h2>
        <p className="about-text-new">
          ARKAA is a team of ambitious developers and creators united by one mission — building technology that solves real problems. 
          We combine expertise in full-stack development, AI/ML, mobile applications, and UI/UX design to deliver products that stand out. 
          From hackathons to production-ready solutions, we approach every project with the same fire and dedication.
        </p>
      </section>

      {/* What We Do Section */}
      <section className="section-wrapper">
        <span className="section-label">02. WHAT WE DO</span>
        <h2 className="section-heading">From idea to impact — we cover it all.</h2>
        <div className="problem-grid">
          <div className="problem-card">
            <h3>Web Development</h3>
            <p>Modern, responsive web applications built with React, Next.js, and cutting-edge frontend technologies. We craft pixel-perfect interfaces backed by robust, scalable backends using Node.js, Python, and cloud infrastructure.</p>
          </div>
          <div className="problem-card solution-card">
            <h3>AI & Machine Learning</h3>
            <p>Intelligent solutions powered by machine learning, natural language processing, and computer vision. From embedded AI models to cloud-based inference, we bring smart automation to real-world problems.</p>
          </div>
          <div className="problem-card">
            <h3>Mobile Applications</h3>
            <p>Cross-platform mobile experiences built with React Native and native Android development. We design apps that feel natural, perform fast, and delight users on every device.</p>
          </div>
          <div className="problem-card solution-card">
            <h3>Desktop & System Tools</h3>
            <p>Powerful desktop applications using Electron, Python, and system-level programming. From security tools to productivity apps, we build software that works at every level of the stack.</p>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="section-wrapper" id="releases">
        <span className="section-label">03. FEATURED PROJECTS</span>
        <h2 className="section-heading">Built by ARKAA — shipping real products.</h2>
        <div className="problem-grid">
          <div className="problem-card">
            <h3><Cpu className="release-icon" /> Arka — Secure Erase Engine</h3>
            <p><strong>Status:</strong> Production Ready<br /><strong>Stack:</strong> Electron + Python + AI<br /><strong>Platform:</strong> Windows, Android<br /><br />AI-powered data destruction tool with NIST 800-88 compliance. Reads actual file content to detect sensitive data, then permanently destroys it with military-grade algorithms. 100% offline.</p>
          </div>
          <div className="problem-card">
            <h3><Globe className="release-icon" /> ARKAA Portfolio</h3>
            <p><strong>Status:</strong> Live<br /><strong>Stack:</strong> React + Vite + GSAP<br /><strong>Platform:</strong> Web<br /><br />The website you're looking at right now! A modern, animated team portfolio showcasing our work, skills, and team members with smooth transitions and responsive design.</p>
          </div>
          <a href="https://wt2-seven.vercel.app" target="_blank" rel="noopener noreferrer" className="problem-card-link">
            <div className="problem-card">
              <h3><Users className="release-icon" /> ECS Mentoring System</h3>
              <p><strong>Status:</strong> Live<br /><strong>Stack:</strong> Web<br /><strong>Platform:</strong> Web<br /><br />A mentoring platform connecting mentors and mentees. Visit the live project to explore.</p>
            </div>
          </a>
          <div className="problem-card">
            <h3><Smartphone className="release-icon" /> Upcoming Mobile App</h3>
            <p><strong>Status:</strong> In Development<br /><strong>Stack:</strong> React Native<br /><strong>Platform:</strong> Android & iOS<br /><br />A cross-platform mobile application currently under development. Stay tuned for more details as we bring our next big idea to life.</p>
          </div>
          <div className="problem-card solution-card">
            <h3><Rocket className="release-icon" /> More Coming Soon</h3>
            <p><strong>Status:</strong> Ideation<br /><strong>Stack:</strong> TBD<br /><strong>Platform:</strong> Multi-platform<br /><br />We're always working on something new. From AI-powered tools to creative web experiences — our pipeline is packed with ambitious projects waiting to ship.</p>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
};

export default Home;

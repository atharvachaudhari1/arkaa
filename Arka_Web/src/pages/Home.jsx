import { useState, useEffect, useRef } from 'react';
import ContactSection from '../components/ContactSection.jsx';
import { Cpu, Globe, Rocket, Smartphone, Users } from 'lucide-react';

const AWARDS_IMAGES = [
  {
    src: '/awards-sih-2025.png',
    title: 'SIH Hardware Edition 2025',
    subtitle: 'Winner — ₹1,50,000',
  },
  {
    src: '/awards-social-media.png',
    title: 'Best Social Media Presence',
    subtitle: 'Team Arka',
  },
];

const AWARDS_INTERVAL = 4000;

const Home = ({ onContactClick }) => {
  const awardsRef = useRef(null);
  const [awardsVisible, setAwardsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible) setAwardsVisible(true);
        setIsInView(visible);
      },
      { threshold: 0.15 }
    );
    if (awardsRef.current) obs.observe(awardsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % AWARDS_IMAGES.length);
    }, AWARDS_INTERVAL);
    return () => clearInterval(timer);
  }, [isInView]);

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
            <h1 className="hero-title">WE ARE TEAM ARKAA.</h1>
            <p className="hero-subtitle">
              ARKAA brings together creative minds and technical experts to design, develop, and deploy digital solutions that matter.
            </p>
          </div>

          <div className="hero-right">
            <p className="hero-description">
              From ideation to execution — we build with clarity, innovation, and impact.
            </p>
            <button className="hero-cta" onClick={onContactClick}>Work with Us</button>
          </div>
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

      {/* Tagline Section - Separate from What We Do */}
      <section className="section-wrapper section-tagline">
        <h2 className="section-heading-tagline">From idea to impact — we cover it all.</h2>
      </section>

      {/* ARKAA Achievements Section */}
      <section className="section-wrapper" ref={awardsRef}>
        <span className="section-label">02. ARKAA ACHIEVEMENTS</span>
        <div className="awards-carousel-wrapper">
          <div
            className="awards-grid-horizontal"
            style={{ transform: `translateX(-${activeSlide * (100 / AWARDS_IMAGES.length)}%)` }}
          >
            {AWARDS_IMAGES.map((item, i) => (
              <div
                key={item.src}
                className={`awards-card-3d ${awardsVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.35}s` }}
              >
                <div className="awards-card-inner">
                  <div className="awards-card-front">
                    <img src={item.src} alt={item.title} loading="eager" decoding="async" />
                    <div className="awards-card-overlay">
                      <h4>{item.title}</h4>
                      <p>{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="awards-dots">
            {AWARDS_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`awards-dot ${i === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
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
          <a href="https://wt-untoched.vercel.app/" target="_blank" rel="noopener noreferrer" className="problem-card-link">
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

import ArkaIcon from '../assets/icons/Arka.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-header">
        <p className="footer-subtitle">WANT TO BUILD SOMETHING GREAT?</p>
        <h2 className="footer-title">Let's work together <span>↗</span></h2>
      </div>

      <div className="footer-content">
        <div className="footer-column footer-brand">
          <div className="footer-logo-text">
            <img src={ArkaIcon} alt="ARKAA" height="32" style={{ filter: 'invert(1)' }} />
            <span>ARKAA</span>
          </div>
          <div className="footer-company">
            <p className="detail-label" style={{ marginBottom: '0.5rem' }}>TEAM ARKAA</p>
            <p className="detail-value" style={{ fontSize: '0.85rem', opacity: 0.6 }}>Innovate · Create · Deliver</p>
            <p className="detail-value" style={{ fontSize: '0.85rem', opacity: 0.6 }}>A passionate team of developers building digital products that matter.</p>
          </div>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <ul className="footer-links">
            <li><a href="mailto:Arka.engine@gmail.com">Arka.engine@gmail.com <span>→</span></a></li>
            <li><a href="tel:+919619290827">+91 9619290827 <span>→</span></a></li>
            <li><a href="https://github.com/Utsav-Singh-35" target="_blank" rel="noopener noreferrer">GitHub <span>→</span></a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Stay in touch</h3>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">→</button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import seveIcon from '../assets/icons/SEVE.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-header">
        <p className="footer-subtitle">INTERESTED IN LEARNING MORE?</p>
        <h2 className="footer-title">Connect with us <span>↗</span></h2>
      </div>

      <div className="footer-content">
        <div className="footer-column footer-brand">
          <div className="footer-logo-text">
            <img src={seveIcon} alt="SEVE" height="32" style={{ filter: 'invert(1)' }} />
            <span>SEVE</span>
          </div>
          <div className="footer-company">
            <p className="detail-label" style={{ marginBottom: '0.5rem' }}>TEAM BYTECODE</p>
            <p className="detail-value" style={{ fontSize: '0.85rem', opacity: 0.6 }}>Developed by Team ByteCode  </p>
            <p className="detail-value" style={{ fontSize: '0.85rem', opacity: 0.6 }}>Three developers building the data destruction tool we wish existed.  </p></div>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <ul className="footer-links">
            <li><a href="mailto:seve.engine@gmail.com">seve.engine@gmail.com <span>→</span></a></li>
            <li><a href="tel:+919619290827">+91 9619290827 <span>→</span></a></li>
            <li><a href="https://github.com/Utsav-Singh-35/SEVE-Release" target="_blank" rel="noopener noreferrer">Github <span>→</span></a></li>
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
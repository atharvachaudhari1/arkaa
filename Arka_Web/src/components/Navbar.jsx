import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArkaIcon from '../assets/icons/Arka.svg';

const Navbar = ({ onContactClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    closeMobileMenu();
    if (onContactClick) {
      onContactClick();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }} onClick={closeMobileMenu}>
          <img src={ArkaIcon} alt="ARKAA" width="40" height="40" />
          <span>ARKAA</span>
          <span className="nav-tagline">| Team Portfolio</span>
        </Link>

        <button className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/#home" onClick={closeMobileMenu}>Home</Link></li>
          <li><Link to="/#about" onClick={closeMobileMenu}>About</Link></li>
          <li><Link to="/#projects" onClick={closeMobileMenu}>Projects</Link></li>
          <li><Link to="/#team" onClick={closeMobileMenu}>Team</Link></li>
          <li><Link to="/skills" onClick={closeMobileMenu}>Skills</Link></li>
          <li><Link to="/#contact" onClick={closeMobileMenu}>Contact</Link></li>
          <li className="mobile-only"><button className="nav-cta" onClick={handleContactClick}>Let's connect</button></li>
        </ul>

        <button className="nav-cta desktop-only" onClick={handleContactClick}>Let's connect</button>
      </div>
    </nav>
  );
};

export default Navbar;

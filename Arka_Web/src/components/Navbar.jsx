import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArkaIcon from '../assets/icons/Arka.svg';

const Navbar = ({ onGetArkaClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleGetArkaClick = () => {
    closeMobileMenu();
    if (onGetArkaClick) {
      onGetArkaClick();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }} onClick={closeMobileMenu}>
          <img src={ArkaIcon} alt="Arka" width="40" height="40" />
          <span>Arka</span>
          <span className="nav-tagline">| Security Engine</span>
        </Link>

        <button className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/#home" onClick={closeMobileMenu}>Why Arka</Link></li>
          <li><Link to="/#about" onClick={closeMobileMenu}>About</Link></li>
          <li><Link to="/#features" onClick={closeMobileMenu}>Features</Link></li>
          <li><Link to="/#contact" onClick={closeMobileMenu}>Contacts</Link></li>
          <li><Link to="/how-it-works" onClick={closeMobileMenu}>How it Works</Link></li>
          <li><Link to="/docs" onClick={closeMobileMenu}>Docs</Link></li>
          <li className="mobile-only"><button className="nav-cta" onClick={handleGetArkaClick}>Get Arka</button></li>
        </ul>

        <button className="nav-cta desktop-only" onClick={handleGetArkaClick}>Get Arka</button>
      </div>
    </nav>
  );
};

export default Navbar;
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ArkaAnimation from './components/ArkaAnimation.jsx';
import Navbar from './components/Navbar.jsx';
import GetArkaForm from './components/GetArkaForm.jsx';
import Home from './pages/Home.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import Docs from './pages/Docs.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

// Scroll to top on route change or handle hash scrolling
const ScrollHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  const [showMainContent, setShowMainContent] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Lock scroll during animation and reset on mount
  useEffect(() => {
    if (!showMainContent) {
      document.body.classList.add('no-scroll');
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup on unmount
    return () => document.body.classList.remove('no-scroll');
  }, [showMainContent]);

  const handleAnimationComplete = () => {
    setShowMainContent(true);
    // Double ensure we are at top when Hero reveals
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  const handleContactClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <Router>
      <ScrollHandler />
      <div className="app-container">
        {/* ARKAA Starting Animation - Removed from DOM once complete */}
        {!showMainContent && <ArkaAnimation onAnimationComplete={handleAnimationComplete} />}

        {/* Main Website Content (hidden initially) */}
        <div className={`main-content ${showMainContent ? 'visible' : ''}`} id="mainContent">
          <Navbar onContactClick={handleContactClick} />
          <Routes>
            <Route path="/" element={<Home onContactClick={handleContactClick} />} />
            <Route path="/our-work" element={<HowItWorks />} />
            <Route path="/skills" element={<Docs />} />
          </Routes>
          <Footer />
        </div>

        {/* Hire Us Form Modal - Global */}
        <GetArkaForm isOpen={isFormOpen} onClose={handleCloseForm} />
      </div>
    </Router>
  );
}

export default App;

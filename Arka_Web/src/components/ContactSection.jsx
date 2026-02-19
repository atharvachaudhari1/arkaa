import ArkaIcon from '../assets/icons/Arka.svg';

const ContactSection = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-left">
          <div className="company-logo">
            <h2>Meet Team ARKAA</h2>
          </div>

          <div className="company-details" id="team">
            <div className="detail-item">
              <div className="parent">
                {/* Atharva Chaudhari */}
                <div className="div1">
                  <span className="dev-name">Atharva Chaudhari</span>
                  <span className="dev-role">Full-Stack Developer</span>
                  <div className="dev-social-links">
                    <a href="https://github.com/atharvachaudhari1" target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/atharva-chaudhari-89a469329/" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://www.instagram.com/jalgaonkar_atharva/" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper">
                      <svg className="social-icon instagram-icon" width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Allan Fernandes */}
                <div className="div2">
                  <span className="dev-name">Allan Fernandes</span>
                  <span className="dev-role">Backend Developer</span>
                  <div className="dev-social-links">
                    <a href="https://github.com/fernandesallan745-eng" target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/allan-fernandes-8a3497349" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://www.instagram.com/fns.allannn/" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper">
                      <svg className="social-icon instagram-icon" width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Saanvi Chamoli */}
                <div className="div3">
                  <span className="dev-name">Saanvi Chamoli</span>
                  <span className="dev-role">Frontend Developer</span>
                  <div className="dev-social-links">
                    <a href="https://www.linkedin.com/in/saanvi-chamoli-8908b8312" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://www.instagram.com/saanvi.chamoli/" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper">
                      <svg className="social-icon instagram-icon" width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-right">
          <h2 className="form-title">Get in Touch</h2>

          <form action="https://api.web3forms.com/submit" method="POST" className="contact-form">
            <input type="hidden" name="access_key" value="a0bdaca0-3c89-44f9-9998-67a034612002" />
            <input type="hidden" name="redirect" value="https://web3forms.com/success" />

            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="4" required></textarea>
            </div>

            <button type="submit" className="form-submit-btn">Send message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

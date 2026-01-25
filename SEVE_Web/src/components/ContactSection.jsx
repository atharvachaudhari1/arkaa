import seveIcon from '../assets/icons/SEVE.svg';

const ContactSection = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-left">
          <div className="company-logo">
            {/* <img src={seveIcon} alt="SEVE" /> */}
            <h2>Meet the Developers</h2>
          </div>

          <div className="company-details">
            <div className="detail-item">
              <div className="parent">
                {/* Utsav Singh */}
                <div className="div1">
                  <span className="dev-name">Utsav Singh</span>
                  <div className="dev-social-links">
                    <a href="https://github.com/Utsav-Singh-35" target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/utsavsingh35/" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://utsavsingh35.vercel.app/" target="_blank" rel="noopener noreferrer">
                      <img src="/profile.png" alt="Portfolio" className="social-icon" />
                    </a>
                  </div>
                </div>

                {/* Om Singh */}
                <div className="div2">
                  <span className="dev-name">Om Singh</span>
                  <div className="dev-social-links">
                    <a href="https://github.com/Jayom5797" target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/5797omsingh/" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://om07.vercel.app/" target="_blank" rel="noopener noreferrer">
                      <img src="/profile.png" alt="Portfolio" className="social-icon" />
                    </a>
                  </div>
                </div>

                {/* Reetika Yadav */}
                <div className="div2">
                  <span className="dev-name">Reetika Yadav</span>
                  <div className="dev-social-links">
                    <a href="https://github.com/reetika0104" target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/reetika-yadav-a38979327" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://github.com/reetika0104/" target="_blank" rel="noopener noreferrer">
                      <img src="/profile.png" alt="Portfolio" className="social-icon" />
                    </a>
                  </div>
                </div>

                {/* Vikas Tiwari */}
                <div className="div3">
                  <span className="dev-name">Vikas Tiwari</span>
                  <div className="dev-social-links">
                    <a href="https://github.com/Cyberexe1" target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/1045-vikas-tiwari/" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://vikas-tiwari-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">
                      <img src="/profile.png" alt="Portfolio" className="social-icon" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-right">
          <h2 className="form-title">Contact us</h2>

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

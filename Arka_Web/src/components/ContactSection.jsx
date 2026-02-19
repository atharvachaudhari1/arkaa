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
                    <a href="https://www.linkedin.com/in/atharvachaudhari1/" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                  </div>
                </div>

                {/* Allan Fernandes */}
                <div className="div2">
                  <span className="dev-name">Allan Fernandes</span>
                  <span className="dev-role">Backend Developer</span>
                  <div className="dev-social-links">
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                  </div>
                </div>

                {/* Saanvi Chamoli */}
                <div className="div3">
                  <span className="dev-name">Saanvi Chamoli</span>
                  <span className="dev-role">Frontend Developer</span>
                  <div className="dev-social-links">
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
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

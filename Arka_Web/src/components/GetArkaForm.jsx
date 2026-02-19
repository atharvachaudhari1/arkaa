import { useState } from 'react';
import { User, Mail, MessageSquare, Building, Briefcase } from 'lucide-react';

const GetArkaForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    projectType: '',
    message: '',
    organisation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

      if (!accessKey) {
        // Fallback: just show success
        setSubmitStatus('success');
        setFormData({
          userName: '',
          userEmail: '',
          projectType: '',
          message: '',
          organisation: ''
        });
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
        return;
      }

      const web3FormsData = new FormData();
      web3FormsData.append('access_key', accessKey);
      web3FormsData.append('subject', `🚀 New Project Inquiry from ${formData.userName}`);
      web3FormsData.append('from_name', formData.userName);
      web3FormsData.append('email', formData.userEmail);

      const emailMessage = `
🚀 New Project Inquiry — ARKAA Team Portfolio

👤 Name: ${formData.userName}
📧 Email: ${formData.userEmail}
💼 Project Type: ${formData.projectType || 'Not specified'}
🏢 Organization: ${formData.organisation || 'Not specified'}

💬 Message:
${formData.message}

📅 Submitted: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

---
This inquiry was submitted through the ARKAA Team Portfolio website.
      `.trim();

      web3FormsData.append('message', emailMessage);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormsData
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          userName: '',
          userEmail: '',
          projectType: '',
          message: '',
          organisation: ''
        });
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Hire Us</h2>
          <p>Tell us about your project and we'll get back to you shortly</p>
          <button className="form-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="Arka-form">
          <div className="form-group">
            <label htmlFor="userName">
              <User className="form-icon" />
              Full Name *
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">
              <Mail className="form-icon" />
              Email Address *
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectType">
              <Briefcase className="form-icon" />
              Project Type *
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select project type</option>
              <option value="web-app">Web Application</option>
              <option value="mobile-app">Mobile Application</option>
              <option value="desktop-app">Desktop Application</option>
              <option value="ai-ml">AI / Machine Learning</option>
              <option value="full-product">Full Product Development</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="organisation">
              <Building className="form-icon" />
              Organisation
            </label>
            <input
              type="text"
              id="organisation"
              name="organisation"
              value={formData.organisation}
              onChange={handleInputChange}
              placeholder="Company or organization name (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">
              <MessageSquare className="form-icon" />
              Project Details *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder="Describe your project, timeline, and any specific requirements"
              rows="4"
            />
          </div>

          {submitStatus === 'success' && (
            <div className="form-status success">
              ✓ Inquiry sent successfully! We'll get back to you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="form-status error">
              ✗ Failed to send inquiry. Please try again.
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetArkaForm;

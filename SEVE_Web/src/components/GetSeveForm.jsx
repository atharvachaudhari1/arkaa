import { useState } from 'react';
import { User, Mail, Monitor, Building, Target, Crown } from 'lucide-react';

const GetSeveForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    product: '',
    purpose: '',
    organisation: '',
    premiumType: ''
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

  const sendEmailNotification = async (formData) => {
    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

      console.log('🔍 Web3Forms Debug Info:');
      console.log('Access Key:', accessKey ? 'Set ✅' : 'Missing ❌');

      if (!accessKey) {
        console.warn('Web3Forms access key missing, skipping email notification');
        return false;
      }

      // Prepare form data for Web3Forms
      const web3FormsData = new FormData();
      web3FormsData.append('access_key', accessKey);
      web3FormsData.append('subject', `🔒 New SEVE Request from ${formData.userName}`);
      web3FormsData.append('from_name', formData.userName);
      web3FormsData.append('email', formData.userEmail);
      
      // Get platform-specific icon
      const getPlatformIcon = (platform) => {
        switch (platform.toLowerCase()) {
          case 'windows': return '🪟';
          case 'linux': return '🐧';
          case 'macos': return '🍎';
          default: return '💻';
        }
      };

      // Get premium type icon
      const getPremiumIcon = (type) => {
        switch (type.toLowerCase()) {
          case 'professional': return '💼';
          case 'enterprise': return '🏢';
          default: return '👑';
        }
      };

      // Create formatted message with proper line breaks and relevant icons
      const message = `
🔒 New SEVE Request Details:

👤 Name: ${formData.userName}
📧 Email: ${formData.userEmail}
${getPlatformIcon(formData.product)} Platform: ${formData.product.charAt(0).toUpperCase() + formData.product.slice(1)}
🏢 Organization: ${formData.organisation || 'Not specified'}
${getPremiumIcon(formData.premiumType)} Premium Type: ${formData.premiumType.charAt(0).toUpperCase() + formData.premiumType.slice(1)}

🎯 Purpose:
${formData.purpose}

📅 Submitted: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

---
This request was submitted through the SEVE website form.
Reply directly to this email to contact the user.
      `.trim();

      web3FormsData.append('message', message);

      console.log('📧 Sending email via Web3Forms...');

      // Send to Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormsData
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Email sent successfully via Web3Forms:', result);
        return true;
      } else {
        console.error('❌ Web3Forms error:', result.message);
        return false;
      }

    } catch (error) {
      console.error('❌ Failed to send email notification:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Submit to backend API
      const response = await fetch('/api/seve-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Send email notification
        const emailSent = await sendEmailNotification(formData);
        
        setSubmitStatus('success');
        setFormData({
          userName: '',
          userEmail: '',
          product: '',
          purpose: '',
          organisation: '',
          premiumType: ''
        });
        
        // Show different message based on database availability
        if (!result.savedToDatabase) {
          console.log('Form submitted but saved locally (database unavailable)');
        }
        
        if (emailSent) {
          console.log('Email notification sent to SEVE team');
        }
        
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error('Failed to submit form');
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
          <h2>Get SEVE</h2>
          <p>Request access to SEVE's AI-powered data destruction platform</p>
          <button className="form-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="seve-form">
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
            <label htmlFor="product">
              <Monitor className="form-icon" />
              Product Platform *
            </label>
            <select
              id="product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              required
            >
              <option value="">Select platform</option>
              <option value="windows">Windows</option>
              <option value="linux">Linux</option>
              <option value="macos">macOS</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="purpose">
              <Target className="form-icon" />
              Purpose *
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              required
              placeholder="Describe your use case and requirements"
              rows="3"
            />
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
            <label htmlFor="premiumType">
              <Crown className="form-icon" />
              Premium Type *
            </label>
            <select
              id="premiumType"
              name="premiumType"
              value={formData.premiumType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select premium type</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {submitStatus === 'success' && (
            <div className="form-status success">
              ✓ Request submitted successfully! We'll contact you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="form-status error">
              ✗ Failed to submit request. Please try again.
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
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetSeveForm;
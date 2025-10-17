import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const containerStyle = {
    minHeight: '100vh',
    background: 'white',
    padding: '4rem 2rem',
    color: '#333'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '3rem',
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '3rem',
    alignItems: 'start'
  };

  const cardStyle = {
    background: '#f8f9fa',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid #e9ecef',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease'
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '1.5rem 0',
    padding: '1rem',
    background: 'white',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    transition: 'background 0.3s ease'
  };

  const iconStyle = {
    fontSize: '1.5rem',
    color: '#667eea',
    width: '40px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const inputStyle = {
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    background: 'white',
    color: '#333',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    padding: '1rem 2rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
    color: '#333',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Contact Us</h1>
        
        <div style={gridStyle}>
          <div 
            style={cardStyle}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={{ marginBottom: '2rem', color: '#667eea' }}>Get in Touch</h2>
            
            <div 
              style={contactItemStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <i className="fas fa-envelope" style={iconStyle}></i>
              <div>
                <strong>Email</strong><br/>
                support@sportsinventory.com
              </div>
            </div>

            <div 
              style={contactItemStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <i className="fas fa-phone" style={iconStyle}></i>
              <div>
                <strong>Phone</strong><br/>
                +1 (555) 123-4567
              </div>
            </div>

            <div 
              style={contactItemStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <i className="fas fa-map-marker-alt" style={iconStyle}></i>
              <div>
                <strong>Address</strong><br/>
                123 Sports Ave, Athletic City, AC 12345
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', color: '#667eea' }}>Support Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>

          <div 
            style={cardStyle}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={{ marginBottom: '2rem', color: '#667eea' }}>Send Message</h2>
            
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#4CAF50', marginBottom: '1rem' }}></i>
                <h3>Message Sent!</h3>
                <p>We'll get back to you soon.</p>
              </div>
            ) : (
              <form style={formStyle} onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                  onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                  onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{...inputStyle, minHeight: '120px', resize: 'vertical'}}
                  onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                  onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  required
                />
                <button
                  type="submit"
                  style={buttonStyle}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
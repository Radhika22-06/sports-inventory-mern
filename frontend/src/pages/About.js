import React from 'react';

const About = () => {
  const containerStyle = {
    minHeight: '100vh',
    background: 'white',
    padding: '4rem 2rem',
    color: '#333'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '2rem',
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'fadeInUp 1s ease-out'
  };

  const cardStyle = {
    background: '#f8f9fa',
    borderRadius: '20px',
    padding: '2rem',
    margin: '2rem 0',
    border: '1px solid #e9ecef',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  };

  const featuresStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '3rem'
  };

  const featureStyle = {
    ...cardStyle,
    textAlign: 'left'
  };

  const iconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: '#667eea'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div style={contentStyle}>
        <h1 style={titleStyle}>About Sports Inventory Pro</h1>
        
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-10px)';
            e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
            Sports Inventory Pro is a comprehensive management system designed to streamline 
            sports equipment inventory for teams, schools, and organizations. Our platform 
            revolutionizes how you track, manage, and distribute sports equipment.
          </p>
        </div>

        <div style={featuresStyle}>
          <div 
            style={featureStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-chart-line" style={iconStyle}></i>
            <h3>Real-time Analytics</h3>
            <p>Track inventory levels, usage patterns, and equipment lifecycle with powerful analytics dashboard.</p>
          </div>

          <div 
            style={featureStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-users" style={iconStyle}></i>
            <h3>Multi-Role Access</h3>
            <p>Secure role-based access for admins, coaches, and players with customized permissions.</p>
          </div>

          <div 
            style={featureStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-mobile-alt" style={iconStyle}></i>
            <h3>Mobile Responsive</h3>
            <p>Access your inventory anywhere, anytime with our fully responsive design.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
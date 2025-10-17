import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ user }) => {
  const actionStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#333',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'block'
  };

  const actions = [
    {
      title: '📦 Add New Item',
      description: 'Add sports equipment to inventory',
      link: '/inventory',
      color: '#4facfe'
    },
    {
      title: '📊 View Reports',
      description: 'Check inventory statistics',
      link: '/dashboard',
      color: '#43e97b'
    },
    {
      title: '🔍 Search Items',
      description: 'Find specific equipment',
      link: '/inventory',
      color: '#fa709a'
    },
    {
      title: '⚠️ Low Stock Alert',
      description: 'Check items running low',
      link: '/inventory?filter=low-stock',
      color: '#ff9a9e'
    }
  ];

  if (!user) return null;

  return (
    <div style={{ padding: '3rem 2rem', backgroundColor: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>⚡ Quick Actions</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            style={actionStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: action.color, 
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              {action.title.split(' ')[0]}
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>{action.title}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '1rem 0',
    borderBottom: '1px solid var(--border-color)'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle = {
    color: 'var(--primary-color)',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    '@media (max-width: 768px)': {
      display: isMenuOpen ? 'flex' : 'none',
      flexDirection: 'column',
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: 'var(--primary-color)',
      padding: '1rem'
    }
  };

  const linkStyle = (active = false) => ({
    color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    background: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
    ':hover': {
      background: 'rgba(37, 99, 235, 0.1)',
      color: 'var(--primary-color)',
      transform: 'translateY(-2px)'
    }
  });

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: 'var(--text-primary)'
  };

  const roleStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: user?.role === 'admin' ? 'var(--danger-color)' : 'var(--success-color)',
    color: 'white'
  };

  const logoutBtnStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--danger-color)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size="medium" />
        </Link>
        
        <button 
          style={{
            display: 'none',
            '@media (max-width: 768px)': { display: 'block' },
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <div style={navLinksStyle}>
          {user ? (
            <>

              <Link to="/dashboard" style={linkStyle(user.role === 'player' ? false : isActive('/dashboard'))}>
                <i className="fas fa-chart-dashboard"></i> Dashboard
              </Link>
              <Link to="/inventory" style={linkStyle(isActive('/inventory'))}>
                <i className="fas fa-boxes"></i> Inventory
              </Link>
              <Link to="/categories" style={linkStyle(isActive('/categories'))}>
                <i className="fas fa-tags"></i> Categories
              </Link>
              {user.role === 'admin' ? (
                <>
                  <Link to="/issues" style={linkStyle(isActive('/issues'))}>
                    <i className="fas fa-clipboard-list"></i> Issues
                  </Link>
                  <Link to="/request-management" style={linkStyle(isActive('/request-management'))}>
                    <i className="fas fa-tasks"></i> Requests
                  </Link>
                </>
              ) : (
                <Link to="/requests" style={linkStyle(isActive('/requests'))}>
                  <i className="fas fa-paper-plane"></i> Requests
                </Link>
              )}
              <Link to="/profile" style={linkStyle(isActive('/profile'))}>
                <i className="fas fa-user"></i> Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/users" style={linkStyle(isActive('/users'))}>
                  <i className="fas fa-users"></i> Users
                </Link>
              )}
              
              <div style={userInfoStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user.name}</span>
                  <span style={roleStyle}>{user.role.toUpperCase()}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  style={logoutBtnStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#dc2626';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--danger-color)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" style={linkStyle(isActive('/'))} onClick={() => navigate('/')}>
                <i className="fas fa-home"></i> Home
              </Link>
              <Link to="/about" style={linkStyle(isActive('/about'))}>
                <i className="fas fa-info-circle"></i> About
              </Link>
              <Link to="/contact" style={linkStyle(isActive('/contact'))}>
                <i className="fas fa-envelope"></i> Contact
              </Link>
              <Link to="/login" style={linkStyle(isActive('/login'))}>
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link to="/register" style={linkStyle(isActive('/register'))}>
                <i className="fas fa-user-plus"></i> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuickActions from '../components/QuickActions';
import ImageCarousel from '../components/ImageCarousel';
import Logo from '../components/Logo';
import '../styles/Home.css';
import axios from 'axios';



const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, inStock: 0, outOfStock: 0, lowStock: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: 'Cricket', icon: '🏏', count: 0 },
    { name: 'Football', icon: '⚽', count: 0 },
    { name: 'Basketball', icon: '🏀', count: 0 },
    { name: 'Tennis', icon: '🎾', count: 0 },
    { name: 'Badminton', icon: '🏸', count: 0 },
    { name: 'Swimming', icon: '🏊', count: 0 }
  ];

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchRecentItems();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/inventory');
      const items = response.data;
      setStats({
        total: items.length,
        inStock: items.filter(item => item.status === 'in-stock').length,
        outOfStock: items.filter(item => item.status === 'out-of-stock').length,
        lowStock: items.filter(item => item.status === 'low-stock').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const response = await axios.get('/api/inventory');
      setRecentItems(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching recent items:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/inventory?category=${encodeURIComponent(category)}`);
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
    color: 'var(--text-primary)',
    padding: '4rem 2rem',
    textAlign: 'center',
    minHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      minHeight: '100vh'
    }}>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      {/* Hero Section */}
      <div style={heroStyle}>
        <ImageCarousel />
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          🏆 Champions Corner
        </h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.9 }}>
          {user ? `Welcome back, ${user.name}! Manage your sports equipment efficiently.` : 'Empowering College Athletes with Premium Sports Equipment'}
        </p>
        {user ? (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{
                  padding: '1rem 1.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  width: '300px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <button type="submit" className="btn" style={{
                background: 'var(--accent-color)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                <i className="fas fa-search" style={{ marginRight: '0.5rem' }}></i>
                Search
              </button>
            </form>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/inventory" className="btn" style={{
                background: 'var(--accent-color)',
                color: 'white',
                padding: '1rem 2rem',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                <i className="fas fa-boxes" style={{ marginRight: '0.5rem' }}></i>
                View Inventory
              </Link>
              <Link to="/inventory" className="btn btn-secondary" style={{
                background: 'transparent',
                color: 'white',
                padding: '1rem 2rem',
                textDecoration: 'none',
                borderRadius: '50px',
                border: '2px solid white',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
                Add Items
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link to="/login" className="btn" style={{
              background: 'var(--accent-color)',
              color: 'white',
              padding: '1rem 2rem',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              <i className="fas fa-sign-in-alt" style={{ marginRight: '0.5rem' }}></i>
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{
              background: 'transparent',
              color: 'white',
              padding: '1rem 2rem',
              textDecoration: 'none',
              borderRadius: '50px',
              border: '2px solid white',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              <i className="fas fa-user-plus" style={{ marginRight: '0.5rem' }}></i>
              Register
            </Link>
          </div>
        )}
      </div>

      {user && (
        <>
          {/* Stats Section */}
          <div style={{ padding: '3rem 2rem', background: 'var(--bg-secondary)' }}>
            <div className="container">
              <h2 className="text-center mb-4" style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '700' }}>
                <i className="fas fa-chart-bar" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
                Inventory Overview
              </h2>
              <div className="grid grid-4">
                <div className="card" style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '4rem', opacity: 0.2 }}>
                    <i className="fas fa-boxes"></i>
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', opacity: 0.9 }}>Total Items</h3>
                    <p style={{ fontSize: '3rem', fontWeight: '700', margin: 0 }}>{stats.total}</p>
                  </div>
                </div>
                <div className="card" style={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '4rem', opacity: 0.2 }}>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', opacity: 0.9 }}>In Stock</h3>
                    <p style={{ fontSize: '3rem', fontWeight: '700', margin: 0 }}>{stats.inStock}</p>
                  </div>
                </div>
                <div className="card" style={{
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '4rem', opacity: 0.2 }}>
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', opacity: 0.9 }}>Low Stock</h3>
                    <p style={{ fontSize: '3rem', fontWeight: '700', margin: 0 }}>{stats.lowStock}</p>
                  </div>
                </div>
                <div className="card" style={{
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '4rem', opacity: 0.2 }}>
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', opacity: 0.9 }}>Out of Stock</h3>
                    <p style={{ fontSize: '3rem', fontWeight: '700', margin: 0 }}>{stats.outOfStock}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Items */}
          {recentItems.length > 0 && (
            <div style={{ padding: '3rem 2rem' }}>
              <div className="container">
                <h2 className="text-center mb-4" style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '700' }}>
                  <i className="fas fa-clock" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
                  Recent Items
                </h2>
                <div className="grid grid-3">
                  {recentItems.map((item, index) => (
                    <div key={index} className="card">
                      <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>{item.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <i className="fas fa-tag" style={{ color: 'var(--primary-color)' }}></i>
                        <span style={{ color: 'var(--text-secondary)' }}>Category: {item.category}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <i className="fas fa-boxes" style={{ color: 'var(--primary-color)' }}></i>
                        <span style={{ color: 'var(--text-secondary)' }}>Quantity: {item.quantity}</span>
                      </div>
                      <div className={`status-badge ${
                        item.status === 'in-stock' ? 'status-in-stock' :
                        item.status === 'low-stock' ? 'status-low-stock' : 'status-out-of-stock'
                      }`}>
                        <i className={`fas ${
                          item.status === 'in-stock' ? 'fa-check' :
                          item.status === 'low-stock' ? 'fa-exclamation' : 'fa-times'
                        }`}></i>
                        {item.status ? item.status.replace('-', ' ') : 'Unknown'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category Shortcuts */}
          <div style={{ padding: '3rem 2rem', background: 'var(--bg-secondary)' }}>
            <div className="container">
              <h2 className="text-center mb-4" style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '700' }}>
                <i className="fas fa-trophy" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
                Sports Categories
              </h2>
              <div className="grid grid-3">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => handleCategoryClick(category.name)}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                      color: 'white',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.icon}</div>
                      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{category.name}</h3>
                      <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>
                        <i className="fas fa-mouse-pointer" style={{ marginRight: '0.25rem' }}></i>
                        Click to view items
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <QuickActions user={user} />

      {/* Equipment Showcase */}
      {!user && (
        <div style={{ padding: '3rem 2rem', background: 'var(--bg-secondary)' }}>
          <div className="container">
            <h2 className="text-center mb-4" style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '700' }}>
              <i className="fas fa-shopping-cart" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
              Available Equipment
            </h2>
            <div className="grid grid-4">
              <div className="card" style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🏏</div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Cricket Bat</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Professional cricket bat for all skill levels</p>
                </div>
                <button onClick={() => navigate('/register')} style={{
                  width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
                  cursor: 'pointer', transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                  <i className="fas fa-hand-paper" style={{ marginRight: '0.5rem' }}></i>Issue Equipment
                </button>
              </div>
              
              <div className="card" style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'bounce 2s infinite 0.2s' }}>⚽</div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Football</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>High-quality football for training and matches</p>
                </div>
                <button onClick={() => navigate('/register')} style={{
                  width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
                  cursor: 'pointer', transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                  <i className="fas fa-hand-paper" style={{ marginRight: '0.5rem' }}></i>Issue Equipment
                </button>
              </div>
              
              <div className="card" style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'bounce 2s infinite 0.4s' }}>🏀</div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Basketball</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Official size basketball for indoor/outdoor play</p>
                </div>
                <button onClick={() => navigate('/register')} style={{
                  width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
                  cursor: 'pointer', transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                  <i className="fas fa-hand-paper" style={{ marginRight: '0.5rem' }}></i>Issue Equipment
                </button>
              </div>

              <div className="card" style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'bounce 2s infinite 0.6s' }}>🎾</div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Tennis Racket</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Professional tennis racket with strings</p>
                </div>
                <button onClick={() => navigate('/register')} style={{
                  width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
                  cursor: 'pointer', transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                  <i className="fas fa-hand-paper" style={{ marginRight: '0.5rem' }}></i>Issue Equipment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div style={{ padding: '3rem 2rem' }}>
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '700' }}>
            <i className="fas fa-rocket" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
            Features
          </h2>
          <div className="grid grid-4">
            <div className="card text-center" style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)', animation: 'pulse 2s infinite' }}>
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Real-time Tracking</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Monitor equipment availability and usage patterns with live updates and analytics.</p>
            </div>
            
            <div className="card text-center" style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 193, 7, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--warning-color)', animation: 'pulse 2s infinite 0.5s' }}>
                <i className="fas fa-bell"></i>
              </div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Smart Notifications</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Automated alerts for equipment requests, returns, and maintenance schedules.</p>
            </div>
            
            <div className="card text-center" style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(40, 167, 69, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--success-color)', animation: 'pulse 2s infinite 1s' }}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Secure Access</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Advanced security features with role-based access control and data protection.</p>
            </div>
            
            <div className="card text-center" style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(72, 187, 120, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#48bb78', animation: 'pulse 2s infinite 1.5s' }}>
                <i className="fas fa-clipboard-check"></i>
              </div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Easy Requests</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Simple equipment request system with approval workflow and status tracking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'linear-gradient(135deg, #2d3748, #4a5568)', color: 'white', padding: '3rem 2rem 2rem' }}>
        <div className="container">
          <div className="grid grid-3 mb-4">
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <Logo size="medium" style={{ color: 'white' }} />
              </div>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>Professional sports equipment management system for efficient inventory tracking and management.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-link"></i>
                Quick Links
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/inventory" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.3s' }}>Inventory</Link>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.3s' }}>Dashboard</Link>
                {!user && <Link to="/login" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.3s' }}>Login</Link>}
                {!user && <Link to="/register" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.3s' }}>Register</Link>}
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-address-book"></i>
                Contact Info
              </h4>
              <div style={{ opacity: 0.8, lineHeight: '1.6' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-envelope"></i>
                  support@championscorner.com
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-phone"></i>
                  +91 8989896756
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-map-marker-alt"></i>
                  DYPCET Sports Department
                </p>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem', textAlign: 'center', opacity: 0.8 }}>
            <p>&copy; 2025 Champions Corner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
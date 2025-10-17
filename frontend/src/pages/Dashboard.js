import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, inStock: 0, outOfStock: 0, lowStock: 0 });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [itemsRes, lowStockRes] = await Promise.all([
        axios.get('/api/inventory'),
        axios.get('/api/inventory/low-stock')
      ]);
      
      const items = itemsRes.data;
      setStats({
        total: items.length,
        inStock: items.filter(item => item.stockStatus === 'in-stock').length,
        outOfStock: items.filter(item => item.stockStatus === 'out-of-stock').length,
        lowStock: items.filter(item => item.stockStatus === 'low-stock').length
      });
      setLowStockItems(lowStockRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, bgGradient }) => (
    <div className="card" style={{
      background: bgGradient,
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        fontSize: '4rem',
        opacity: 0.2
      }}>
        <i className={icon}></i>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', opacity: 0.9 }}>
          {title}
        </h3>
        <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>
          {loading ? '...' : value}
        </p>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, link, color }) => (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        textAlign: 'center',
        cursor: 'pointer',
        border: `2px solid ${color}`,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.background = `${color}10`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.background = 'var(--bg-primary)';
      }}>
        <div style={{ fontSize: '2.5rem', color, marginBottom: '1rem' }}>
          <i className={icon}></i>
        </div>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{description}</p>
      </div>
    </Link>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Header */}
        <div className="card mb-4" style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
            Here's what's happening with your sports inventory today
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px'
          }}>
            <i className="fas fa-user-shield"></i>
            <span style={{ fontWeight: '600' }}>{user?.role?.toUpperCase()}</span>
          </div>
        </div>

        {/* Stats Grid - Different for players */}
        {user?.role === 'player' ? (
          <div className="grid grid-2 mb-4">
            <div className="card" style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏃</div>
              <h3 style={{ marginBottom: '0.5rem' }}>My Requests</h3>
              <p style={{ opacity: 0.9 }}>View and manage your equipment requests</p>
              <Link to="/requests" style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600'
              }}>
                View Requests
              </Link>
            </div>
            <div className="card" style={{
              background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
              color: 'white',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Browse Equipment</h3>
              <p style={{ opacity: 0.9 }}>Explore available sports equipment</p>
              <Link to="/inventory" style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600'
              }}>
                Browse Items
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-4 mb-4">
            <StatCard
              title="Total Items"
              value={stats.total}
              icon="fas fa-boxes"
              color="var(--info-color)"
              bgGradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
            <StatCard
              title="In Stock"
              value={stats.inStock}
              icon="fas fa-check-circle"
              color="var(--success-color)"
              bgGradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            />
            <StatCard
              title="Low Stock"
              value={stats.lowStock}
              icon="fas fa-exclamation-triangle"
              color="var(--warning-color)"
              bgGradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            />
            <StatCard
              title="Out of Stock"
              value={stats.outOfStock}
              icon="fas fa-times-circle"
              color="var(--danger-color)"
              bgGradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
            />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Content based on user role */}
          <div>
            {user?.role === 'player' ? (
              <div className="card" style={{
                border: '2px solid var(--success-color)',
                background: 'linear-gradient(135deg, #d4edda, #c3e6cb)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <i className="fas fa-info-circle" style={{ color: '#155724', fontSize: '1.5rem' }}></i>
                  <h3 style={{ color: '#155724', margin: 0 }}>Available Equipment</h3>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                  <h4 style={{ color: '#155724', marginBottom: '1rem' }}>Ready to Play!</h4>
                  <p style={{ color: '#155724', marginBottom: '1.5rem' }}>
                    {stats.inStock} items are currently available for you to request.
                  </p>
                  <Link to="/requests" style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    background: 'var(--success-color)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                    Make Request
                  </Link>
                </div>
              </div>
            ) : (
              lowStockItems.length > 0 && (
                <div className="card" style={{
                  border: '2px solid var(--warning-color)',
                  background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: '#856404', fontSize: '1.5rem' }}></i>
                    <h3 style={{ color: '#856404', margin: 0 }}>Items Requiring Attention</h3>
                  </div>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {lowStockItems.map(item => (
                      <div key={item._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: 'var(--border-radius-sm)',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <div>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                            {item.name}
                          </span>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {item.sport || 'N/A'}
                          </div>
                        </div>
                        <div className={`status-badge ${
                          item.stockStatus === 'out-of-stock' ? 'status-out-of-stock' : 'status-low-stock'
                        }`}>
                          <i className={`fas ${
                            item.stockStatus === 'out-of-stock' ? 'fa-times' : 'fa-exclamation'
                          }`}></i>
                          {item.quantity} left
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;
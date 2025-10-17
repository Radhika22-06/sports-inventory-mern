import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '', department: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        department: user.department || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.put('/api/auth/profile', formData);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return 'fa-user-shield';
      case 'staff': return 'fa-user-tie';
      case 'coach': return 'fa-whistle';
      default: return 'fa-user';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'var(--danger-color)';
      case 'staff': return 'var(--warning-color)';
      case 'coach': return 'var(--info-color)';
      default: return 'var(--success-color)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Header */}
        <div className="card mb-4" style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            My Profile
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
            Manage your account information and preferences
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Profile Info Card */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-id-card" style={{ color: 'var(--primary-color)' }}></i>
              Account Information
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-envelope" style={{ color: 'var(--primary-color)' }}></i>
                  <strong>Email Address</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{user?.email}</p>
              </div>
              
              <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className={`fas ${getRoleIcon(user?.role)}`} style={{ color: getRoleColor(user?.role) }}></i>
                  <strong>Role</strong>
                </div>
                <div className="status-badge" style={{ 
                  background: `${getRoleColor(user?.role)}20`,
                  color: getRoleColor(user?.role),
                  display: 'inline-flex'
                }}>
                  <i className={`fas ${getRoleIcon(user?.role)}`}></i>
                  {user?.role?.toUpperCase()}
                </div>
              </div>
              
              <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-calendar-alt" style={{ color: 'var(--primary-color)' }}></i>
                  <strong>Member Since</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-edit" style={{ color: 'var(--primary-color)' }}></i>
              Edit Profile
            </h3>
            
            {message && (
              <div style={{
                padding: '1rem',
                borderRadius: 'var(--border-radius-sm)',
                marginBottom: '1.5rem',
                background: message.includes('success') ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                color: message.includes('success') ? 'var(--success-color)' : 'var(--danger-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className={`fas ${message.includes('success') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-user" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-phone" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-building" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-input"
                  placeholder="Enter your department"
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i>
                    Update Profile
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem', maxWidth: '1000px', margin: '2rem auto 0' }}>
          <div className="card text-center">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Account Security</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Your account is protected with secure authentication
            </p>
          </div>
          
          <div className="card text-center">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--success-color)' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Profile Complete</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Keep your information updated for better experience
            </p>
          </div>
          
          <div className="card text-center">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--info-color)' }}>
              <i className="fas fa-headset"></i>
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Need Help?</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Contact support for any account-related queries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
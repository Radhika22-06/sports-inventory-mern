import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'player', phone: '', department: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/register', formData);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (formData.name && formData.email && formData.password) {
      setStep(2);
    }
  };

  const roleData = {
    player: { icon: '🏃', color: '#10b981', desc: 'Access equipment requests' },
    coach: { icon: '🔔', color: '#3b82f6', desc: 'Manage team equipment' },
    staff: { icon: '👔', color: '#f59e0b', desc: 'Inventory management' },
    admin: { icon: '🛡️', color: '#ef4444', desc: 'Full system access' }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Shapes */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        top: '5%',
        right: '10%',
        animation: 'morph 8s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        bottom: '10%',
        left: '5%',
        animation: 'morph 10s ease-in-out infinite reverse'
      }}></div>

      {/* Floating Sports Equipment */}
      <div style={{
        position: 'absolute',
        fontSize: '4rem',
        top: '20%',
        left: '15%',
        opacity: 0.15,
        animation: 'spin 20s linear infinite'
      }}>🏏</div>
      <div style={{
        position: 'absolute',
        fontSize: '3rem',
        bottom: '25%',
        right: '20%',
        opacity: 0.15,
        animation: 'spin 15s linear infinite reverse'
      }}>⚽</div>
      <div style={{
        position: 'absolute',
        fontSize: '2.5rem',
        top: '50%',
        right: '5%',
        opacity: 0.15,
        animation: 'spin 25s linear infinite'
      }}>🏀</div>

      <style>
        {`
          @keyframes morph {
            0%, 100% { 
              border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
              transform: rotate(0deg) scale(1);
            }
            25% { 
              border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
              transform: rotate(90deg) scale(1.1);
            }
            50% { 
              border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
              transform: rotate(180deg) scale(0.9);
            }
            75% { 
              border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
              transform: rotate(270deg) scale(1.05);
            }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>

      <div style={{
        background: 'var(--bg-primary)',
        backdropFilter: 'blur(25px)',
        borderRadius: '25px',
        padding: '3rem',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        animation: 'slideUp 1s ease-out',
        position: 'relative'
      }}>
        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(102, 126, 234, 0.2)',
          borderRadius: '2px',
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: step === 1 ? '50%' : '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '2px',
            transition: 'width 0.5s ease'
          }}></div>
        </div>

        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Logo size="xlarge" showText={false} style={{ animation: 'pulse 3s ease-in-out infinite' }} />
          </div>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Champions Corner
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Step {step} of 2 - {step === 1 ? 'Basic Information' : 'Additional Details'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '15px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid #fca5a5'
          }}>
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  position: 'relative',
                  background: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: '15px',
                  border: '2px solid rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fas fa-user" style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#667eea',
                    fontSize: '1.1rem'
                  }}></i>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '1rem',
                      outline: 'none',
                      color: 'var(--text-primary)'
                    }}
                    onFocus={(e) => e.target.parentElement.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.parentElement.style.borderColor = 'rgba(102, 126, 234, 0.1)'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  position: 'relative',
                  background: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: '15px',
                  border: '2px solid rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fas fa-envelope" style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#667eea',
                    fontSize: '1.1rem'
                  }}></i>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '1rem',
                      outline: 'none',
                      color: 'var(--text-primary)'
                    }}
                    onFocus={(e) => e.target.parentElement.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.parentElement.style.borderColor = 'rgba(102, 126, 234, 0.1)'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  position: 'relative',
                  background: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: '15px',
                  border: '2px solid rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fas fa-lock" style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#667eea',
                    fontSize: '1.1rem'
                  }}></i>
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '1rem',
                      outline: 'none',
                      color: 'var(--text-primary)'
                    }}
                    onFocus={(e) => e.target.parentElement.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.parentElement.style.borderColor = 'rgba(102, 126, 234, 0.1)'}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                }}
              >
                <i className="fas fa-arrow-right" style={{ marginRight: '0.5rem' }}></i>
                Continue
              </button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Select Your Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {Object.entries(roleData).map(([role, data]) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      style={{
                        padding: '1rem',
                        border: formData.role === role ? `2px solid ${data.color}` : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        background: formData.role === role ? `${data.color}15` : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{data.icon}</div>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', color: data.color }}>
                        {role.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {data.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                  position: 'relative',
                  background: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: '12px',
                  border: '2px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <i className="fas fa-phone" style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#667eea',
                    fontSize: '1rem'
                  }}></i>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '0.9rem',
                      outline: 'none',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div style={{
                  position: 'relative',
                  background: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: '12px',
                  border: '2px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <i className="fas fa-building" style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#667eea',
                    fontSize: '1rem'
                  }}></i>
                  <input
                    type="text"
                    placeholder="Department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '0.9rem',
                      outline: 'none',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '1rem',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus" style={{ marginRight: '0.5rem' }}></i>
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Already have an account?
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <i className="fas fa-sign-in-alt"></i>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
import React from 'react';
import '../styles/logo.css';

const Logo = ({ size = 'medium', showText = true, style = {} }) => {
  const sizes = {
    small: { width: '40px', height: '40px', fontSize: '1.2rem', textSize: '1rem' },
    medium: { width: '60px', height: '60px', fontSize: '1.8rem', textSize: '1.2rem' },
    large: { width: '80px', height: '80px', fontSize: '2rem', textSize: '1.5rem' },
    xlarge: { width: '90px', height: '90px', fontSize: '2.5rem', textSize: '2rem' }
  };

  const currentSize = sizes[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', ...style }}>
      <div style={{
        width: currentSize.width,
        height: currentSize.height,
        background: 'linear-gradient(135deg, #1e293b, #334155)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: currentSize.fontSize,
        boxShadow: '0 8px 25px rgba(30, 41, 59, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        border: '3px solid #8b5cf6'
      }}>
        <div style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          background: 'conic-gradient(from 0deg, #8b5cf6, #a855f7, #c084fc, #8b5cf6)',
          borderRadius: '50%',
          animation: 'spin 8s linear infinite',
          opacity: 0.3
        }}></div>
        <span style={{ position: 'relative', zIndex: 1, color: '#8b5cf6', fontWeight: 'bold' }}>CC</span>
      </div>
      {showText && (
        <span style={{
          fontSize: currentSize.textSize,
          fontWeight: '700',
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: '#8b5cf6'
        }}>
          Champions Corner
        </span>
      )}
    </div>
  );
};

export default Logo;
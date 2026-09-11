import React from 'react';
import { Bell, ShieldCheck, Menu } from 'lucide-react';

const Navbar = ({ user, mobileMenuOpen, setMobileMenuOpen }) => {
  const getInitial = (name) => {
    if (!name) return 'S';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {setMobileMenuOpen && (
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={22} color="#1e293b" />
          </button>
        )}

        <ShieldCheck size={22} color="#2563eb" className="brand-logo-icon" />
        <span className="portal-header-title">
          College Grievance Portal
        </span>
      </div>

      <div className="user-badge">
        <div style={{ padding: '0.45rem', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={18} color="#64748b" />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.75rem', borderLeft: '1px solid #e2e8f0' }}>
          <div className="avatar">
            {getInitial(user?.name)}
          </div>
          <div className="user-info-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="user-name">{user?.name || (user?.role === 'admin' ? 'Administrator' : 'Student')}</span>
              {user?.role === 'admin' && (
                <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)', color: '#ffffff', padding: '0.15rem 0.45rem', borderRadius: '6px', letterSpacing: '0.04em' }}>
                  ADMIN
                </span>
              )}
            </div>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

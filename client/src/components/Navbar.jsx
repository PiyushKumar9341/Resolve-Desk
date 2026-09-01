import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';

const Navbar = ({ user }) => {
  const getInitial = (name) => {
    if (!name) return 'S';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck size={22} color="#2563eb" />
        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
          College Grievance Portal
        </span>
      </div>

      <div className="user-badge">
        <div style={{ padding: '0.5rem', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={18} color="#64748b" />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.75rem', borderLeft: '1px solid #e2e8f0' }}>
          <div className="avatar">
            {getInitial(user?.name)}
          </div>
          <div className="user-info-text">
            <span className="user-name">{user?.name || 'Student'}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

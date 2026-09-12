import React, { useState } from 'react';
import { updateProfileApi } from '../services/api';
import UserAvatar from '../components/UserAvatar';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ShieldCheck, 
  Phone, 
  BookOpen, 
  Hash, 
  Lock, 
  Sparkles,
  Building,
  Award,
  ShieldAlert
} from 'lucide-react';

const ProfilePage = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfileApi(name);
      if (res.success) {
        setSuccessMsg('Display name updated successfully.');
        setEditing(false);
        onUpdateUser(res.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const maskEmail = (emailStr) => {
    if (!emailStr || !emailStr.includes('@')) return 'student.id@galgotiacollege.edu';
    
    const [localPart] = emailStr.split('@');
    const domain = 'galgotiacollege.edu';
    
    if (localPart.length <= 4) {
      return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
    }
    
    const firstTwo = localPart.substring(0, 2);
    const lastTwo = localPart.substring(localPart.length - 2);
    return `${firstTwo}****${lastTwo}@${domain}`;
  };

  // Format Roll Number prefix if present in email
  const rollNo = user?.email ? user.email.split('@')[0].toUpperCase() : 'GCET-STD-2023';
  const isStudent = user?.role !== 'admin';

  return (
    <div className="page-content" style={{ maxWidth: '860px', margin: '0 auto' }}>
      
      {/* Executive Institutional ID Card Banner */}
      <div 
        className="card"
        style={{
          padding: 0,
          overflow: 'hidden',
          marginBottom: '1.75rem',
          border: '1px solid var(--border-glass)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Cover Header Graphic */}
        <div 
          style={{
            height: '140px',
            background: isStudent 
              ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)' 
              : 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #8b5cf6 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'rgba(255,255,255,0.95)', fontSize: '0.86rem', fontWeight: 800, letterSpacing: '0.5px', marginLeft: '110px' }}>
            <Building size={16} />
            <span>GALGOTIAS COLLEGE OF ENGINEERING & TECHNOLOGY</span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div style={{ padding: '0 2rem 1.75rem 2rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginTop: '-42px', marginBottom: '1.25rem' }}>
            {/* Floating Glowing Avatar */}
            <div 
              style={{
                position: 'relative',
                display: 'inline-block'
              }}
            >
              <UserAvatar user={user} size={92} style={{ border: '4px solid var(--surface)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.18)' }} />
              <span 
                title="Account Status: Active & Verified"
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '3px solid var(--surface)',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
                  zIndex: 2
                }}
              />
            </div>

            {/* Quick Edit Name Button */}
            {!editing ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(true)}
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Edit3 size={15} color="var(--primary)" />
                Edit Profile Name
              </button>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                ✏️ Editing Profile Name
              </span>
            )}
          </div>

          {/* User Title & Badge Row */}
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {user?.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="badge" style={!isStudent ? { background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', border: '1px solid rgba(124, 58, 237, 0.4)', padding: '0.3rem 0.75rem' } : { background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid var(--border-accent)', padding: '0.3rem 0.75rem' }}>
                <ShieldCheck size={15} /> {!isStudent ? 'Campus Administrator' : 'Enrolled Student Identity'}
              </span>

              <span style={{ fontSize: '0.78rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={14} /> Official Email Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Information Grid */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color="var(--primary)" />
          Academic Identity & Account Credentials
        </h3>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            
            {/* Display Name Field */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem 1.15rem', borderRadius: '16px', border: editing ? '2px solid var(--primary)' : '1px solid var(--border)', transition: 'all 0.2s ease' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', uppercase: 'true', letterSpacing: '0.5px' }}>
                FULL DISPLAY NAME
              </label>
              {editing ? (
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--primary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', height: '42px', fontSize: '0.95rem', fontWeight: 700 }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  <User size={18} color="var(--primary)" />
                  <span>{user?.name}</span>
                </div>
              )}
            </div>

            {/* Official Email Field (Locked) */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem 1.15rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                  OFFICIAL INSTITUTIONAL EMAIL
                </label>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Lock size={11} /> Bound
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <Mail size={18} color="var(--primary)" />
                <span style={{ wordBreak: 'break-all' }}>{user?.email}</span>
              </div>
            </div>

            {/* Roll Number / Student ID */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem 1.15rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                REGISTRATION / ROLL NUMBER
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <Hash size={18} color="var(--primary)" />
                <span style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{rollNo}</span>
              </div>
            </div>

            {/* Academic Department */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem 1.15rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                COURSE & ACADEMIC BRANCH
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <BookOpen size={18} color="var(--primary)" />
                <span>{!isStudent ? 'Administrative Governance & Control' : 'B.Tech - Computer Science & Engineering'}</span>
              </div>
            </div>

            {/* Registration Date */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem 1.15rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                PORTAL REGISTRATION DATE
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <Calendar size={18} color="var(--primary)" />
                <span>{formatDate(user?.createdAt)}</span>
              </div>
            </div>

            {/* Portal Access Role */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem 1.15rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                PORTAL ACCESS ROLE
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <Award size={18} color="var(--primary)" />
                <span>{!isStudent ? 'Campus Administrator (Authority Control)' : 'Student Access (Grievance Filing & Upvoting)'}</span>
              </div>
            </div>

          </div>

          {/* Action Buttons when editing */}
          {editing && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setName(user?.name || '');
                  setEditing(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={18} />
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Security & Governance Audit Warning Notice */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.14) 0%, rgba(220, 38, 38, 0.07) 100%)',
          border: '1.5px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '20px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          gap: '1.15rem',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.08)'
        }}
      >
        <div 
          style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '14px', 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
            color: '#ffffff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
          }}
        >
          <ShieldAlert size={24} color="#ffffff" style={{ display: 'block' }} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            Institutional Security & Audit Warning
            <span style={{ fontSize: '0.68rem', background: '#dc2626', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 800, letterSpacing: '0.5px' }}>
              STRICT DISCIPLINARY LOG
            </span>
          </h4>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Account bound to college email <strong style={{ color: '#ef4444' }}>{maskEmail(user?.email)}</strong>. All grievances submitted through this profile carry a cryptographically logged timestamp and verified audit trail.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;

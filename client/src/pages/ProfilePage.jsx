import React, { useState } from 'react';
import { updateProfileApi } from '../services/api';
import { User, Mail, Shield, Calendar, Edit3, CheckCircle2, AlertCircle, Save } from 'lucide-react';

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

  return (
    <div className="page-content" style={{ maxWidth: '700px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '1.6rem' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span className="badge" style={user?.role === 'admin' ? { background: '#0f172a', color: '#60a5fa', border: '1px solid #3b82f6' } : { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                <Shield size={12} /> {user?.role === 'admin' ? 'Administrator Account' : 'Student Account'}
              </span>
            </div>

          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ shrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} style={{ shrink: 0, marginTop: '2px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">
                Display Name (Extracted from Email)
              </label>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Edit3 size={14} />
                  Edit Name
                </button>
              )}
            </div>
            
            <div style={{ position: 'relative' }}>
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem', background: '#f1f5f9', color: '#64748b' }}
                value={user?.email || ''}
                disabled
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Portal Registration Date</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem', background: '#f1f5f9', color: '#64748b' }}
                value={formatDate(user?.createdAt)}
                disabled
              />
            </div>
          </div>

          {editing && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
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
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

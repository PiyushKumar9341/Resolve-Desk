import React, { useState } from 'react';
import { createComplaintApi } from '../services/api';
import { Send, AlertCircle, CheckCircle2, FilePlus, HelpCircle, Home, GraduationCap, Users, Building, MoreHorizontal } from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'Hostel', label: 'Hostel', icon: Home },
  { id: 'Academic', label: 'Academic', icon: GraduationCap },
  { id: 'Faculty', label: 'Faculty', icon: Users },
  { id: 'Infrastructure', label: 'Infrastructure', icon: Building },
  { id: 'Other', label: 'Other', icon: MoreHorizontal },
];

const NewComplaintPage = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hostel');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!title.trim()) {
      setError('Please provide a descriptive title for your grievance.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide detailed description of the complaint.');
      return;
    }

    setLoading(true);
    try {
      const res = await createComplaintApi({
        title,
        category,
        description
      });

      if (res.success) {
        setSuccessMsg('Grievance submitted successfully. Redirecting to My Complaints...');
        setTitle('');
        setDescription('');
        
        setTimeout(() => {
          onNavigate('my-complaints');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '820px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)' }}>
            <FilePlus size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Submit New Grievance</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Provide full details of your concern for administration action</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Complaint Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="e.g. WiFi not working in Block B Hostel / Missing Marks Sheet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Category <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="category-grid">
              {CATEGORY_ITEMS.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <Icon size={16} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="description">
                Detailed Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                {description.length} characters
              </span>
            </div>
            <textarea
              id="description"
              className="form-textarea"
              rows={6}
              placeholder="Describe what happened, room number/building location, specific dates, or relevant details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '16px', marginBottom: '1.75rem', border: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <HelpCircle size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Submitted grievances are assigned a unique tracking code (<strong>GRV-YYYY-XXXX</strong>) and routed directly to department coordinators. You can track resolution progress in real-time under <strong>My Complaints</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate('dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Send size={18} />
              {loading ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaintPage;

import React, { useState } from 'react';
import { createComplaintApi } from '../services/api';
import { Send, AlertCircle, CheckCircle2, FilePlus, HelpCircle, Home, GraduationCap, Building, Utensils, MoreHorizontal, MapPin } from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'Hostel', label: 'Hostel', icon: Home },
  { id: 'Academic', label: 'Academic', icon: GraduationCap },
  { id: 'Infrastructure', label: 'Infrastructure', icon: Building },
  { id: 'Canteen & Mess', label: 'Canteen & Mess', icon: Utensils },
  { id: 'Other', label: 'Other', icon: MoreHorizontal },
];

const SUB_CATEGORIES = {
  Hostel: ['Wi-Fi & Network', 'Plumbing & Water', 'Electricity & Fan/AC', 'Cleanliness & Hygiene', 'Furniture & Bed'],
  Academic: ['Classroom Smart Board/Projector', 'Lab Equipment & Computers', 'Department Equipment', 'General Academic Facility'],
  Infrastructure: ['Lift & Elevator', 'Washroom & Hygiene', 'Air Conditioning', 'Lighting & Electrical'],
  'Canteen & Mess': ['Food Quality & Hygiene', 'Seating & Cleanliness', 'General Canteen/Mess Facility'],
  Other: ['General Campus Concern', 'Other']
};

const GCET_BLOCKS = [
  'Block A',
  'Block B',
  'Block C',
  'Block D',
  'GBS Block',
  'Main Canteen / Food Court',
  'Hostel Block',
  'Sports Complex / Ground',
  'Other'
];

const NewComplaintPage = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hostel');
  const [subCategory, setSubCategory] = useState('Wi-Fi & Network');
  const [blockLocation, setBlockLocation] = useState('Block A');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const subList = SUB_CATEGORIES[newCat] || ['General'];
    setSubCategory(subList[0]);
  };

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
        subCategory,
        blockLocation,
        description
      });

      if (res.success) {
        setSuccessMsg('Grievance submitted successfully. Redirecting to Campus Feed...');
        setTitle('');
        setDescription('');
        
        setTimeout(() => {
          onNavigate('campus-feed');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '840px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)' }}>
            <FilePlus size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Submit New Campus Grievance</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Provide full details of your concern for GCET administration action</p>
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
              placeholder="e.g. WiFi not working in Block B Hostel / Smart Board Issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* GCET Block Selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="blockSelect">
                <MapPin size={16} color="#3b82f6" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                GCET Campus Location / Block <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="blockSelect"
                className="form-input"
                value={blockLocation}
                onChange={(e) => setBlockLocation(e.target.value)}
              >
                {GCET_BLOCKS.map((blk) => (
                  <option key={blk} value={blk}>{blk}</option>
                ))}
              </select>
            </div>

            {/* Sub-category Selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="subCatSelect">
                Sub-Category Issue <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="subCatSelect"
                className="form-input"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                {(SUB_CATEGORIES[category] || ['General']).map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pilling */}
          <div className="form-group">
            <label className="form-label">
              Primary Category <span style={{ color: '#ef4444' }}>*</span>
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
                    onClick={() => handleCategoryChange(cat.id)}
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
              Submitted grievances are assigned a tracking code (<strong>GRV-YYYY-XXXX</strong>) and posted to <strong>Campus Feed</strong>. Other affected students can <strong>Upvote (+1)</strong> your issue to automatically escalate it to <strong>URGENT Priority</strong>!
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

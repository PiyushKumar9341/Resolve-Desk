import React, { useState, useEffect } from 'react';
import { createComplaintApi, checkDuplicateComplaintApi, toggleUpvoteApi } from '../services/api';
import { Send, AlertCircle, CheckCircle2, FilePlus, HelpCircle, Home, GraduationCap, Building, Utensils, MoreHorizontal, MapPin, Flame } from 'lucide-react';

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
  Infrastructure: ['Washroom & Hygiene', 'Air Conditioning', 'Lighting & Electrical'],
  'Canteen & Mess': ['Food Quality & Hygiene', 'Seating & Cleanliness', 'General Canteen/Mess Facility'],
  Other: ['General Campus Concern', 'Other']
};

const NewComplaintPage = ({ onNavigate, selectedBlock }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hostel');
  const [subCategory, setSubCategory] = useState('Wi-Fi & Network');
  const blockLocation = selectedBlock || 'Block A';
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Duplicate detection state
  const [duplicates, setDuplicates] = useState([]);
  const [upvotingDupId, setUpvotingDupId] = useState(null);

  useEffect(() => {
    if (!title || title.trim().length < 3) {
      setDuplicates([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await checkDuplicateComplaintApi({
          title,
          blockLocation
        });
        if (res.success) {
          setDuplicates(res.duplicates || []);
        }
      } catch (err) {
        console.error('Duplicate check error:', err);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [title, blockLocation]);

  const handleUpvoteExisting = async (dupId) => {
    setUpvotingDupId(dupId);
    try {
      const res = await toggleUpvoteApi(dupId);
      if (res.success) {
        setSuccessMsg(`Upvoted existing complaint! Redirecting to Dashboard...`);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 1200);
      }
    } catch (err) {
      console.error('Upvote error:', err);
    } finally {
      setUpvotingDupId(null);
    }
  };

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
        setSuccessMsg(`Grievance submitted successfully under ${blockLocation}! Redirecting to Dashboard...`);
        setTitle('');
        setDescription('');

        setTimeout(() => {
          onNavigate('dashboard');
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
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Filing concern directly under <strong style={{ color: '#2563eb' }}>{blockLocation}</strong></p>
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
          {/* Locked Block Location Display */}
          <div style={{ background: '#f0f9ff', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1px solid #bae6fd', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#0369a1', fontWeight: 700 }}>
              <MapPin size={18} color="#0284c7" />
              <span>GCET Campus Building: <strong style={{ color: '#0c4a6e', fontSize: '1.05rem' }}>{blockLocation}</strong></span>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#0284c7', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
              DIRECT DASHBOARD SELECTION
            </span>
          </div>

          {/* Duplicate Complaint Detection Alert Banner */}
          {duplicates.length > 0 && (
            <div style={{ background: '#fff7ed', border: '1.5px solid #ffedd5', padding: '1rem 1.25rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#c2410c', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Flame size={18} color="#f97316" />
                Similar Active Grievance Detected in {blockLocation}:
              </div>
              {duplicates.map((dup) => (
                <div key={dup._id} style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #fed7aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: '6px', marginRight: '0.5rem' }}>
                      {dup.complaintId}
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: '#1e293b' }}>{dup.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {dup.category} &bull; {dup.subCategory} &bull; <span style={{ color: '#f97316', fontWeight: 700 }}>🔥 {dup.upvoteCount} Upvotes</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpvoteExisting(dup._id)}
                    disabled={upvotingDupId === dup._id}
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem', background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', border: 'none' }}
                  >
                    <Flame size={14} />
                    {upvotingDupId === dup._id ? 'Upvoting...' : '+1 Upvote Existing Instead'}
                  </button>
                </div>
              ))}
              <p style={{ fontSize: '0.78rem', color: '#9a3412', marginTop: '0.6rem', marginBottom: 0 }}>
                💡 <em>Upvoting an existing grievance boosts its priority toward <strong>🚨 URGENT</strong> faster than filing a duplicate!</em>
              </p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Complaint Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder={`e.g. WiFi issue in ${blockLocation} / Equipment problem`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Sub-category Selector */}
          <div className="form-group">
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
              placeholder={`Describe what happened in ${blockLocation}, room number, specific details...`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '16px', marginBottom: '1.75rem', border: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <HelpCircle size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Your grievance will be filed directly under <strong>{blockLocation}</strong>. Other affected students in this block can <strong>Upvote (+1)</strong> your issue to automatically escalate it to <strong>URGENT Priority</strong>!
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
              {loading ? 'Submitting...' : `Submit Grievance for ${blockLocation}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaintPage;

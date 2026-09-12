import React, { useState, useEffect } from 'react';
import { createComplaintApi, checkDuplicateComplaintApi, toggleUpvoteApi } from '../services/api';
import { Send, AlertCircle, CheckCircle2, FilePlus, HelpCircle, Home, GraduationCap, Building, Utensils, Trophy, MoreHorizontal, MapPin, Flame } from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'Hostel', label: 'Hostel', icon: Home },
  { id: 'Academic', label: 'Academic', icon: GraduationCap },
  { id: 'Infrastructure', label: 'Infrastructure', icon: Building },
  { id: 'Canteen & Mess', label: 'Canteen & Mess', icon: Utensils },
  { id: 'Sports & Ground', label: 'Sports & Ground', icon: Trophy },
  { id: 'Other', label: 'Other', icon: MoreHorizontal },
];

const SUB_CATEGORIES = {
  Hostel: ['Wi-Fi & Network', 'Plumbing & Water', 'Electricity & Fan/AC', 'Cleanliness & Hygiene', 'Furniture & Bed'],
  Academic: ['Classroom Smart Board/Projector', 'Classroom AC & Ventilation', 'Lab Equipment & Computers', 'Department Equipment', 'General Academic Resource / Library'],
  Infrastructure: ['Washroom & Hygiene', 'Common Area AC & Cooling', 'Lighting & Electrical', 'Building Civil & Maintenance'],
  'Canteen & Mess': ['Food Quality & Hygiene', 'Seating & Cleanliness', 'General Canteen/Mess Facility'],
  'Sports & Ground': [
    'Badminton & Tennis Court Maintenance',
    'Basketball & Volleyball Ground Lighting',
    'Football & Cricket Turf Maintenance',
    'Gym Equipment & Fitness Gear',
    'Sports Kit & Equipment Issuance',
    'Ground Floodlights & Pavilion Facilities'
  ],
  Other: ['General Campus Concern', 'Other']
};

const NewComplaintPage = ({ onNavigate, selectedBlock }) => {
  const blockLocation = selectedBlock || 'Block A';
  
  const isSportsBlock = blockLocation.toLowerCase().includes('sports') || blockLocation.toLowerCase().includes('ground');
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(isSportsBlock ? 'Sports & Ground' : 'Hostel');
  const [subCategory, setSubCategory] = useState(isSportsBlock ? 'Badminton & Tennis Court Maintenance' : 'Wi-Fi & Network');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto update category if selectedBlock changes
  useEffect(() => {
    if (isSportsBlock) {
      setCategory('Sports & Ground');
      setSubCategory('Badminton & Tennis Court Maintenance');
    }
  }, [blockLocation]);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: '52px', height: '52px', background: 'var(--primary-soft)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid var(--border-accent)', boxShadow: '0 4px 12px var(--primary-glow)' }}>
            <FilePlus size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Submit New <span className="text-gradient">Campus Grievance</span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>Filing concern directly under <strong style={{ color: 'var(--primary)' }}>{blockLocation}</strong></p>
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
          <div style={{ background: 'var(--primary-soft)', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border-accent)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>
              <MapPin size={18} color="var(--primary)" />
              <span>Campus Building: <strong style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>{blockLocation}</strong></span>
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--surface-raised)', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-accent)' }}>
              📍 Active Location
            </span>
          </div>

          {/* 1. Primary Category Selector */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem' }}>
              1. Select Primary Category <span style={{ color: 'var(--danger)' }}>*</span>
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

          {/* 2. Sub-category Selector */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="subCatSelect" style={{ fontWeight: 700, fontSize: '0.92rem' }}>
              2. Select Sub-Category Issue <span style={{ color: 'var(--danger)' }}>*</span>
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

          {/* 3. Complaint Title */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="title" style={{ fontWeight: 700, fontSize: '0.92rem' }}>
              3. Complaint Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder={`e.g. Issue in ${subCategory} at ${blockLocation}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Duplicate Complaint Detection Alert Banner */}
          {duplicates.length > 0 && (
            <div style={{ background: 'var(--accent-soft)', border: '1.5px solid var(--accent)', padding: '1rem 1.25rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Flame size={18} color="var(--accent)" />
                Similar Active Grievance Detected in {blockLocation}:
              </div>
              {duplicates.map((dup) => (
                <div key={dup._id} style={{ background: 'var(--surface-raised)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-soft)', padding: '0.15rem 0.5rem', borderRadius: '6px', marginRight: '0.5rem' }}>
                      {dup.complaintId}
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{dup.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {dup.category} &bull; {dup.subCategory} &bull; <span style={{ color: 'var(--accent)', fontWeight: 700 }}>🔥 {dup.upvoteCount} Upvotes</span>
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

          <div style={{ background: 'var(--bg-subtle)', padding: '1.1rem', borderRadius: '16px', marginBottom: '1.75rem', border: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <HelpCircle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
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

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
  Hostel: [
    'Wi-Fi & Internet Network',
    'Plumbing, Washroom & Water Supply',
    'Electricity, Fan, Light & AC',
    'Cleanliness & Hygiene',
    'Furniture & Room Bed',
    'Hostel Mess & Food Quality',
    'Security & Gate Concerns',
    'Other Hostel Issue'
  ],
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

const FLOOR_OPTIONS = [
  'Ground Floor',
  '1st Floor',
  '2nd Floor',
  '3rd Floor',
  '4th Floor',
  'Basement / Common Area'
];

const NewComplaintPage = ({ onNavigate, selectedBlock }) => {
  const blockLocation = selectedBlock || 'Block A';
  
  const getAvailableCategories = (blockStr) => {
    const loc = (blockStr || '').toLowerCase();
    
    // GBS Block has Canteen on Ground floor!
    if (loc.includes('gbs')) {
      return ['Academic', 'Infrastructure', 'Canteen & Mess', 'Other'];
    }

    if (loc.includes('hostel')) {
      return ['Hostel', 'Infrastructure', 'Other'];
    }

    if (loc.includes('canteen') || loc.includes('food')) {
      return ['Canteen & Mess', 'Infrastructure', 'Other'];
    }

    if (loc.includes('sports') || loc.includes('ground')) {
      return ['Sports & Ground', 'Infrastructure', 'Other'];
    }

    // Academic Blocks (Block A, B, C, D)
    if (loc.includes('block')) {
      return ['Academic', 'Infrastructure', 'Other'];
    }

    return ['Hostel', 'Academic', 'Infrastructure', 'Canteen & Mess', 'Sports & Ground', 'Other'];
  };

  const getDefaultCategory = (blockStr) => {
    const available = getAvailableCategories(blockStr);
    return available[0];
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(() => getDefaultCategory(blockLocation));
  const [subCategory, setSubCategory] = useState(() => {
    const defaultCat = getDefaultCategory(blockLocation);
    return (SUB_CATEGORIES[defaultCat] || ['General'])[0];
  });

  const [floorLocation, setFloorLocation] = useState('1st Floor');
  const [roomNumber, setRoomNumber] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto update category if selectedBlock changes
  useEffect(() => {
    const autoCat = getDefaultCategory(blockLocation);
    setCategory(autoCat);
    const subList = SUB_CATEGORIES[autoCat] || ['General'];
    setSubCategory(subList[0]);
  }, [blockLocation]);

  // Duplicate detection state
  const [duplicates, setDuplicates] = useState([]);
  const [upvotingDupId, setUpvotingDupId] = useState(null);

  useEffect(() => {
    if ((!title || title.trim().length < 3) && !roomNumber.trim()) {
      setDuplicates([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await checkDuplicateComplaintApi({
          title,
          blockLocation,
          roomNumber,
          subCategory
        });
        if (res.success) {
          setDuplicates(res.duplicates || []);
        }
      } catch (err) {
        console.error('Duplicate check error:', err);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [title, blockLocation, roomNumber, subCategory]);

  const handleUpvoteExisting = async (dupId) => {
    setUpvotingDupId(dupId);
    try {
      const res = await toggleUpvoteApi(dupId);
      if (res.success) {
        setSuccessMsg(`Upvoted existing complaint! Redirecting to Dashboard...`);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 150);
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
        floorLocation,
        roomNumber: roomNumber.trim(),
        description
      });

      if (res.success) {
        setSuccessMsg(`Grievance submitted successfully under ${blockLocation}! Redirecting...`);
        setTitle('');
        setDescription('');
        setRoomNumber('');

        setTimeout(() => {
          onNavigate('dashboard');
        }, 150);
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
          <div style={{ background: 'var(--primary-soft)', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border-accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>
              <MapPin size={18} color="var(--primary)" />
              <span>Campus Building: <strong style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>{blockLocation}</strong></span>
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--surface-raised)', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-accent)' }}>
              📍 Active Building
            </span>
          </div>

          {/* Prominently Highlighted Upvote & Auto-Escalation Info Banner */}
          <div 
            style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)', 
              padding: '1.1rem 1.25rem', 
              borderRadius: '18px', 
              marginBottom: '1.5rem', 
              border: '1.5px solid var(--border-accent)',
              boxShadow: '0 8px 20px var(--primary-glow)',
              display: 'flex', 
              gap: '0.85rem', 
              alignItems: 'flex-start'
            }}
          >
            <div 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', 
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                marginTop: '2px'
              }}
            >
              <HelpCircle size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Grievance Routing & Escalation Notice
                </span>
                <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.15rem 0.55rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, border: '1px solid rgba(239, 68, 68, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Flame size={12} /> 🚨 AUTO-URGENT ESCALATION
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                Your grievance will be filed directly under <span style={{ background: 'var(--primary)', color: '#ffffff', padding: '0.1rem 0.55rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem' }}>{blockLocation}</span>. Other affected students in this block can <span style={{ color: '#f97316', fontWeight: 800 }}>🔥 Upvote (+1)</span> your issue to automatically escalate it to <strong style={{ color: '#ef4444' }}>URGENT Priority</strong> for faster resolution!
              </p>
            </div>
          </div>

          {/* Floor & Manual Room/Spot Number Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: 'var(--surface-raised)', padding: '1.1rem 1.25rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div>
              <label className="form-label" htmlFor="floorSelect" style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)', marginBottom: '0.45rem', display: 'block' }}>
                🏢 Select Floor / Level <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <select
                id="floorSelect"
                className="form-input custom-select"
                value={floorLocation}
                onChange={(e) => setFloorLocation(e.target.value)}
              >
                {FLOOR_OPTIONS.map((fl) => (
                  <option key={fl} value={fl}>{fl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="manualRoom" style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)', marginBottom: '0.45rem', display: 'block' }}>
                📍 Room No. / Specific Spot <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="manualRoom"
                type="text"
                className="form-input"
                placeholder="e.g. Room 201, Classroom 12, Computer Lab 2, Washroom Area"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* 1. Primary Category Selector */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem' }}>
              1. Select Primary Category <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div className="category-grid">
              {CATEGORY_ITEMS.filter(cat => getAvailableCategories(blockLocation).includes(cat.id)).map((cat) => {
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
            <div style={{ background: 'var(--accent-soft)', border: '1.5px solid var(--accent)', padding: '0.85rem 1rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', fontWeight: 800, color: 'var(--accent)', fontSize: '0.88rem', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Flame size={18} color="var(--accent)" />
                  <span>Similar Active Grievances Detected in {blockLocation} ({duplicates.length})</span>
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Scroll to view</span>
              </div>

              {/* Fixed max-height scrollable container */}
              <div 
                style={{ 
                  maxHeight: '210px', 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.5rem',
                  paddingRight: '4px'
                }}
              >
                {duplicates.map((dup) => (
                  <div key={dup._id} style={{ background: 'var(--surface-raised)', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-soft)', padding: '0.12rem 0.45rem', borderRadius: '6px' }}>
                          {dup.complaintId}
                        </span>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{dup.title}</strong>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>{dup.category} &bull; {dup.subCategory}</span>
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>🔥 {dup.upvoteCount} Upvotes</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUpvoteExisting(dup._id)}
                      disabled={upvotingDupId === dup._id}
                      className="btn btn-primary"
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', border: 'none', borderRadius: '8px' }}
                    >
                      <Flame size={13} />
                      {upvotingDupId === dup._id ? 'Upvoting...' : '+1 Upvote Existing Instead'}
                    </button>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '0.75rem', color: '#9a3412', marginTop: '0.55rem', marginBottom: 0 }}>
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

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
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

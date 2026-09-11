import React, { useState, useEffect } from 'react';
import { getPublicComplaintsApi, toggleUpvoteApi } from '../services/api';
import { 
  Flame, 
  Search, 
  Filter, 
  MapPin, 
  Tag, 
  Calendar, 
  User, 
  ThumbsUp, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  XCircle,
  Sparkles,
  Inbox
} from 'lucide-react';

const GCET_BLOCKS = [
  'All',
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

const CATEGORIES = [
  'All',
  'Hostel',
  'Academic',
  'Infrastructure',
  'Canteen & Mess',
  'Other'
];

const CampusFeedPage = ({ onNavigate }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [upvotingId, setUpvotingId] = useState(null);

  useEffect(() => {
    fetchCampusFeed();
  }, [selectedBlock, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampusFeed();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCampusFeed = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPublicComplaintsApi({
        search: searchTerm,
        block: selectedBlock,
        category: selectedCategory,
        limit: 20
      });
      if (data.success) {
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error('[Fetch Campus Feed Error]', err);
      setError(err.response?.data?.message || 'Failed to load campus feed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUpvote = async (complaintId) => {
    if (upvotingId) return;
    setUpvotingId(complaintId);

    try {
      const res = await toggleUpvoteApi(complaintId);
      if (res.success) {
        setComplaints((prev) =>
          prev.map((item) => {
            if (item._id === complaintId) {
              return {
                ...item,
                hasUpvoted: res.hasUpvoted,
                upvoteCount: res.upvoteCount,
                priority: res.priority
              };
            }
            return item;
          })
        );
      }
    } catch (err) {
      console.error('[Upvote Error]', err);
    } finally {
      setUpvotingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="page-content">
      {/* Header Banner */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', 
          color: 'white', 
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.12)', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Flame size={15} color="#fbbf24" />
              <span style={{ fontWeight: 700 }}>GCET Public Campus Feed &bull; Live Upvotes</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
              Campus Community Grievances 🔥
            </h2>
            <p style={{ color: '#c7d2fe', fontSize: '0.92rem' }}>
              Explore issues raised across GCET blocks. Upvote (+1) issues affecting you to auto-upgrade priority to URGENT!
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onNavigate('new-complaint')}
            style={{ fontSize: '0.92rem', padding: '0.75rem 1.4rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
          >
            + Raise New Concern
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '260px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.6rem' }}
              placeholder="Search by Title, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Block Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={16} color="#3b82f6" /> Block:
            </span>
            <select
              className="form-input"
              style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.88rem' }}
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
            >
              {GCET_BLOCKS.map((blk) => (
                <option key={blk} value={blk}>{blk}</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Tag size={16} color="#8b5cf6" /> Category:
            </span>
            <select
              className="form-input"
              style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.88rem' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <RefreshCw size={36} className="spin" color="#6366f1" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
            Loading Campus Feed...
          </h3>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && complaints.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Inbox size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
            No Public Complaints Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            No grievances match your current filters. Try resetting search or block filter!
          </p>
        </div>
      )}

      {/* Complaints Grid */}
      {!loading && !error && complaints.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {complaints.map((item) => {
            const isUrgent = item.priority === 'Urgent';
            const isHigh = item.priority === 'High';

            return (
              <div 
                key={item._id} 
                className="card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justify: 'space-between',
                  position: 'relative',
                  border: isUrgent ? '1.5px solid #fca5a5' : isHigh ? '1.5px solid #fed7aa' : '1px solid #e2e8f0',
                  boxShadow: isUrgent ? '0 10px 25px -5px rgba(239, 68, 68, 0.15)' : 'var(--shadow-md)'
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                        {item.complaintId}
                      </span>
                      <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} color="#3b82f6" /> {item.blockLocation}
                      </span>
                    </div>

                    <span className={`badge ${item.status.replace(' ', '-')}`}>
                      ● {item.status}
                    </span>
                  </div>

                  {/* Title & Subcategory */}
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, marginBottom: '0.4rem' }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Tag size={13} color="#8b5cf6" />
                    <span>{item.category} &bull; <strong style={{ color: '#475569' }}>{item.subCategory}</strong></span>
                  </div>

                  {/* Description snippet */}
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div>
                  {/* Priority Indicator Badge */}
                  {isUrgent && (
                    <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.4rem 0.75rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', border: '1px solid #fecaca' }}>
                      <Flame size={14} color="#ef4444" /> AUTO-URGENT 🚨 ({item.upvoteCount}+ Upvotes - Campus Emergency)
                    </div>
                  )}

                  {isHigh && (
                    <div style={{ background: '#fff7ed', color: '#c2410c', padding: '0.4rem 0.75rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', border: '1px solid #ffedd5' }}>
                      <Flame size={14} color="#f97316" /> HIGH PRIORITY 🔥 ({item.upvoteCount} Upvotes)
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} /> {formatDate(item.createdAt)}
                    </div>

                    {/* Upvote Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleUpvote(item._id)}
                      disabled={upvotingId === item._id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.45rem 0.95rem',
                        borderRadius: '20px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: item.hasUpvoted
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : '#f1f5f9',
                        color: item.hasUpvoted ? '#ffffff' : '#334155',
                        boxShadow: item.hasUpvoted ? '0 4px 12px rgba(239, 68, 68, 0.35)' : 'none'
                      }}
                    >
                      <Flame size={15} color={item.hasUpvoted ? '#ffffff' : '#f97316'} />
                      <span>{item.hasUpvoted ? 'Upvoted' : 'Upvote (+1)'}</span>
                      <span 
                        style={{ 
                          background: item.hasUpvoted ? 'rgba(255,255,255,0.25)' : '#e2e8f0', 
                          padding: '0.1rem 0.5rem', 
                          borderRadius: '12px', 
                          fontSize: '0.78rem' 
                        }}
                      >
                        {item.upvoteCount}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampusFeedPage;

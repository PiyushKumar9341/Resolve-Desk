import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import ComplaintModal from '../components/ComplaintModal';
import { getStatsApi, getMyComplaintsApi, getPublicComplaintsApi, toggleUpvoteApi } from '../services/api';
import { 
  PlusCircle, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Calendar, 
  Flame, 
  MapPin, 
  Building, 
  Home, 
  GraduationCap, 
  Utensils, 
  Sparkles, 
  Inbox, 
  RefreshCw,
  UserCheck
} from 'lucide-react';

const GCET_BLOCKS = [
  { id: 'Block A', label: 'Block A', subtitle: 'CS / IT / EC', icon: Building },
  { id: 'Block B', label: 'Block B', subtitle: 'Mech / Civil / EE', icon: Building },
  { id: 'Block C', label: 'Block C', subtitle: 'First Year / Applied', icon: Building },
  { id: 'Block D', label: 'Block D', subtitle: 'Labs & Auditorium', icon: Building },
  { id: 'GBS Block', label: 'GBS Block', subtitle: 'MBA & Business', icon: GraduationCap },
  { id: 'Main Canteen / Food Court', label: 'Main Canteen', subtitle: 'Food Court & Dining', icon: Utensils },
  { id: 'Hostel Block', label: 'Hostel Block', subtitle: 'Boys & Girls Hostel', icon: Home },
  { id: 'Sports Complex / Ground', label: 'Sports Complex', subtitle: 'Ground & Gymnasium', icon: Sparkles },
];

const DashboardPage = ({ user, onNavigate }) => {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const [activeTabMode, setActiveTabMode] = useState('block-feed'); // 'block-feed' | 'my-complaints'
  
  const [blockComplaints, setBlockComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upvotingId, setUpvotingId] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTabMode === 'block-feed') {
      fetchBlockComplaints();
    } else {
      fetchMyComplaints();
    }
  }, [selectedBlock, activeTabMode]);

  const fetchStats = async () => {
    try {
      const statsRes = await getStatsApi();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBlockComplaints = async () => {
    setLoading(true);
    try {
      const res = await getPublicComplaintsApi({ block: selectedBlock, limit: 15 });
      if (res.success) {
        setBlockComplaints(res.complaints || []);
      }
    } catch (error) {
      console.error('Error fetching block complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyComplaints = async () => {
    setLoading(true);
    try {
      const res = await getMyComplaintsApi();
      if (res.success) {
        setMyComplaints(res.complaints || []);
      }
    } catch (error) {
      console.error('Error fetching my complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUpvote = async (e, complaintId) => {
    e.stopPropagation();
    if (upvotingId) return;
    setUpvotingId(complaintId);

    try {
      const res = await toggleUpvoteApi(complaintId);
      if (res.success) {
        setBlockComplaints((prev) =>
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
      console.error('Upvote Error:', err);
    } finally {
      setUpvotingId(null);
    }
  };

  const getFirstName = (fullName) => {
    if (!fullName) return 'Student';
    return fullName.split(' ')[0];
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
      {/* Welcome Banner */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
          color: 'white', 
          marginBottom: '1.75rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.15)' }}>
              <ShieldCheck size={14} color="#60a5fa" />
              <span>GCET Student Grievance Console &bull; Block Hub Active</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
              Welcome, {getFirstName(user?.name)} 👋
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              Current Block Selected: <strong style={{ color: '#60a5fa' }}>{selectedBlock}</strong>
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onNavigate('new-complaint', selectedBlock)}
            style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem', background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}
          >
            <PlusCircle size={19} />
            + Raise Complaint for {selectedBlock}
          </button>
        </div>
      </div>

      {/* Stats Counter Section */}
      <StatsCard stats={stats} />

      {/* GCET Campus Block Hub Selector */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              GCET Campus Block Hub (Select Building)
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            Click a block to view & upvote grievances
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem' }}>
          {GCET_BLOCKS.map((blk) => {
            const Icon = blk.icon;
            const isSelected = selectedBlock === blk.id;

            return (
              <button
                key={blk.id}
                type="button"
                onClick={() => setSelectedBlock(blk.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.85rem 1rem',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: isSelected
                    ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                    : '#ffffff',
                  boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.2)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.4rem' }}>
                  <Icon size={20} color={isSelected ? '#2563eb' : '#64748b'} />
                  {isSelected && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#2563eb', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '6px' }}>
                      ACTIVE
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isSelected ? '#1e3a8a' : '#1e293b' }}>
                  {blk.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: isSelected ? '#2563eb' : '#94a3b8', fontWeight: 600 }}>
                  {blk.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Unified Grievance Section */}
      <div className="card">
        {/* Mode Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '4px', borderRadius: '14px' }}>
            <button
              type="button"
              onClick={() => setActiveTabMode('block-feed')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTabMode === 'block-feed' ? '#ffffff' : 'transparent',
                color: activeTabMode === 'block-feed' ? '#2563eb' : '#64748b',
                boxShadow: activeTabMode === 'block-feed' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <Flame size={16} color={activeTabMode === 'block-feed' ? '#f97316' : '#64748b'} />
              {selectedBlock} Feed 🔥
            </button>

            <button
              type="button"
              onClick={() => setActiveTabMode('my-complaints')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTabMode === 'my-complaints' ? '#ffffff' : 'transparent',
                color: activeTabMode === 'my-complaints' ? '#2563eb' : '#64748b',
                boxShadow: activeTabMode === 'my-complaints' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <UserCheck size={16} />
              My Personal Complaints
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => onNavigate('new-complaint', selectedBlock)}
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            + New Complaint ({selectedBlock})
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <RefreshCw size={32} className="spin" color="#2563eb" style={{ margin: '0 auto 0.75rem auto' }} />
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading {selectedBlock} grievances...</p>
          </div>
        )}

        {/* Mode A: Block Feed */}
        {!loading && activeTabMode === 'block-feed' && (
          <>
            {blockComplaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <Inbox size={44} color="#94a3b8" style={{ marginBottom: '0.75rem', opacity: 0.7 }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.3rem' }}>
                  No active grievances for {selectedBlock}
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                  Be the first student to raise an issue for {selectedBlock}.
                </p>
                <button className="btn btn-primary" onClick={() => onNavigate('new-complaint', selectedBlock)}>
                  + Raise Complaint for {selectedBlock}
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {blockComplaints.map((item) => {
                  const isUrgent = item.priority === 'Urgent';
                  const isHigh = item.priority === 'High';

                  return (
                    <div
                      key={item._id}
                      onClick={() => setSelectedComplaint(item)}
                      style={{
                        background: '#ffffff',
                        border: isUrgent ? '1.5px solid #fca5a5' : isHigh ? '1.5px solid #fed7aa' : '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isUrgent ? '0 8px 20px -4px rgba(239, 68, 68, 0.15)' : '0 4px 12px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                            {item.complaintId}
                          </span>
                          <span className={`badge ${item.status.replace(' ', '-')}`}>
                            ● {item.status}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                          {item.title}
                        </h4>

                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Tag size={13} color="#8b5cf6" />
                          <span>{item.category} &bull; <strong style={{ color: '#475569' }}>{item.subCategory}</strong></span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.45, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.description}
                        </p>
                      </div>

                      <div>
                        {isUrgent && (
                          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Flame size={13} color="#ef4444" /> AUTO-URGENT 🚨 ({item.upvoteCount}+ Upvotes)
                          </div>
                        )}

                        {isHigh && (
                          <div style={{ background: '#fff7ed', color: '#c2410c', padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Flame size={13} color="#f97316" /> HIGH PRIORITY 🔥 ({item.upvoteCount} Upvotes)
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={12} /> {formatDate(item.createdAt)}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleToggleUpvote(e, item._id)}
                            disabled={upvotingId === item._id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.35rem 0.8rem',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              background: item.hasUpvoted ? '#dc2626' : '#f1f5f9',
                              color: item.hasUpvoted ? '#ffffff' : '#334155'
                            }}
                          >
                            <Flame size={13} color={item.hasUpvoted ? '#ffffff' : '#f97316'} />
                            <span>{item.hasUpvoted ? 'Upvoted' : '+1 Upvote'}</span>
                            <span style={{ background: item.hasUpvoted ? 'rgba(255,255,255,0.25)' : '#e2e8f0', padding: '0.05rem 0.4rem', borderRadius: '10px', fontSize: '0.75rem' }}>
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
          </>
        )}

        {/* Mode B: My Personal Complaints */}
        {!loading && activeTabMode === 'my-complaints' && (
          <>
            {myComplaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <FileText size={44} color="#94a3b8" style={{ marginBottom: '0.75rem', opacity: 0.7 }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  No personal complaints submitted yet.
                </h4>
                <button className="btn btn-primary" onClick={() => onNavigate('new-complaint', selectedBlock)} style={{ marginTop: '0.75rem' }}>
                  + Raise Complaint
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="complaint-table">
                  <thead>
                    <tr>
                      <th>Complaint ID</th>
                      <th>Location / Block</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myComplaints.map((item) => (
                      <tr key={item._id} onClick={() => setSelectedComplaint(item)}>
                        <td>
                          <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{item.complaintId}</strong>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>
                            {item.blockLocation || 'Block A'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: '#1e293b' }}>{item.title}</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                            {item.category}
                          </span>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {formatDate(item.createdAt)}
                        </td>
                        <td>
                          <span className={`badge ${item.status.replace(' ', '-')}`}>
                            ● {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for viewing complaint details */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;

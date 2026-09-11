import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import ComplaintModal from '../components/ComplaintModal';
import BlockSelectionModal from '../components/BlockSelectionModal';
import { getStatsApi, getMyComplaintsApi, getPublicComplaintsApi, toggleUpvoteApi } from '../services/api';
import { 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Tag, 
  Calendar, 
  Flame, 
  MapPin, 
  Inbox, 
  RefreshCw,
  UserCheck,
  Edit3
} from 'lucide-react';

const DashboardPage = ({ user, onNavigate }) => {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [selectedBlock, setSelectedBlock] = useState(() => {
    return localStorage.getItem('user_gcet_block') || 'Block A';
  });
  
  // Show popup modal if block has not been selected in current session
  const [showBlockModal, setShowBlockModal] = useState(() => {
    return !localStorage.getItem('user_gcet_block');
  });

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

  const handleSelectBlock = (newBlock) => {
    setSelectedBlock(newBlock);
    localStorage.setItem('user_gcet_block', newBlock);
  };

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

  const handleStatCardClick = (statusFilter) => {
    onNavigate('my-complaints', selectedBlock, statusFilter);
  };

  return (
    <div className="page-content">
      {/* Welcome Banner */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', 
          border: '1px solid var(--border-glass)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '1.75rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff' }}>
              <ShieldCheck size={14} color="#60a5fa" />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>GCET Student Grievance System</span>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
              Welcome, <span className="text-gradient-hero">{getFirstName(user?.name)}</span> 👋
            </h2>

            {/* Selected Location Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                Active Location:
              </span>
              <button
                type="button"
                onClick={() => setShowBlockModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#818cf8',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <MapPin size={14} color="#60a5fa" />
                {selectedBlock}
                <Edit3 size={12} style={{ marginLeft: '2px', opacity: 0.8 }} />
              </button>
            </div>
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
      <StatsCard stats={stats} onStatClick={handleStatCardClick} />

      {/* Main Grievance Hub Section */}
      <div className="card">
        {/* Mode Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border)' }}>
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
                background: activeTabMode === 'block-feed' ? 'var(--surface-raised)' : 'transparent',
                color: activeTabMode === 'block-feed' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: activeTabMode === 'block-feed' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <Flame size={16} color={activeTabMode === 'block-feed' ? '#f97316' : 'var(--text-muted)'} />
              {selectedBlock} Grievances 🔥
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
                background: activeTabMode === 'my-complaints' ? 'var(--surface-raised)' : 'transparent',
                color: activeTabMode === 'my-complaints' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: activeTabMode === 'my-complaints' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <UserCheck size={16} />
              My Personal Complaints
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowBlockModal(true)}
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <MapPin size={14} color="#3b82f6" />
              Switch Block ({selectedBlock})
            </button>

            <button
              className="btn btn-primary"
              onClick={() => onNavigate('new-complaint', selectedBlock)}
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
            >
              + New Complaint
            </button>
          </div>
        </div>

        {/* Feed Container with Fixed minHeight to prevent layout shifts */}
        <div style={{ position: 'relative', minHeight: '350px' }}>
          {/* Translucent Glass Loading Overlay */}
          {loading && (
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                zIndex: 10, 
                background: 'var(--surface-glass)', 
                backdropFilter: 'blur(8px)', 
                WebkitBackdropFilter: 'blur(8px)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '20px',
                animation: 'alertFade 0.2s ease'
              }}
            >
              <RefreshCw size={36} className="spin" color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.92rem' }}>Updating {selectedBlock} grievances...</p>
            </div>
          )}

          {/* Mode A: Block Feed */}
          {activeTabMode === 'block-feed' && (
            <>
              {!loading && blockComplaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--bg-subtle)', backdropFilter: 'blur(8px)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                  <Inbox size={44} color="var(--text-muted)" style={{ marginBottom: '0.75rem', opacity: 0.7 }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                    No active grievances for {selectedBlock}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
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
                          background: 'var(--card-bg)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          border: isUrgent ? '1.5px solid #fca5a5' : isHigh ? '1.5px solid #fed7aa' : '1px solid var(--border)',
                          borderRadius: '18px',
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: isUrgent ? '0 8px 20px -4px rgba(239, 68, 68, 0.2)' : 'var(--card-shadow)'
                        }}
                      >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <span style={{ background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-accent)' }}>
                            {item.complaintId}
                          </span>
                          <span className={`badge ${item.status.replace(' ', '-')}`}>
                            ● {item.status}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                          {item.title}
                        </h4>

                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Tag size={13} color="var(--primary)" />
                          <span>{item.category} &bull; <strong style={{ color: 'var(--text-subtle)' }}>{item.subCategory}</strong></span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.description}
                        </p>
                      </div>

                      <div>
                        {isUrgent && (
                          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            <Flame size={13} color="#ef4444" /> AUTO-URGENT 🚨 ({item.upvoteCount}+ Upvotes)
                          </div>
                        )}

                        {isHigh && (
                          <div style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                            <Flame size={13} color="#f97316" /> HIGH PRIORITY 🔥 ({item.upvoteCount} Upvotes)
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={12} /> {formatDate(item.createdAt)}
                          </span>

                          <button
                            type="button"
                            className={`btn-upvote ${item.hasUpvoted ? 'upvote-anim' : ''}`}
                            onClick={(e) => handleToggleUpvote(e, item._id)}
                            disabled={upvotingId === item._id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.38rem 0.85rem',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              border: '1px solid var(--border)',
                              cursor: 'pointer',
                              background: item.hasUpvoted ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'var(--bg-subtle)',
                              color: item.hasUpvoted ? '#ffffff' : 'var(--text-main)',
                              boxShadow: item.hasUpvoted ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none',
                              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                          >
                            <Flame size={13} color={item.hasUpvoted ? '#ffffff' : '#f97316'} />
                            <span>{item.hasUpvoted ? 'Upvoted' : '+1 Upvote'}</span>
                            <span style={{ background: item.hasUpvoted ? 'rgba(255,255,255,0.25)' : 'var(--surface-raised)', padding: '0.05rem 0.4rem', borderRadius: '10px', fontSize: '0.75rem', color: item.hasUpvoted ? '#ffffff' : 'var(--text-main)' }}>
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
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--bg-subtle)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                <FileText size={44} color="var(--text-muted)" style={{ marginBottom: '0.75rem', opacity: 0.7 }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
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
                          <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{item.complaintId}</strong>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                            {item.blockLocation || 'Block A'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--text-main)' }}>{item.title}</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {item.category}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
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
      </div>

      {/* On-Login / Location Switcher Popup Modal */}
      {showBlockModal && (
        <BlockSelectionModal
          selectedBlock={selectedBlock}
          onSelectBlock={handleSelectBlock}
          onClose={() => setShowBlockModal(false)}
        />
      )}

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

import React, { useState, useEffect } from 'react';
import { getAdminStatsApi } from '../../services/api';
import { 
  ShieldCheck, 
  Layers, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Tag, 
  Calendar, 
  RefreshCw, 
  AlertCircle,
  Inbox,
  User
} from 'lucide-react';

const AdminDashboardPage = ({ user, onNavigate }) => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    urgent: 0
  });
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [roomHotspots, setRoomHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminStatsApi();
      if (data.success) {
        setStats(data.stats || {
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          rejected: 0,
          urgent: 0
        });
        setCategoryCounts(data.categoryCounts || []);
        setRecentComplaints(data.recentComplaints || []);
        setRoomHotspots(data.roomHotspots || []);
      }
    } catch (err) {
      console.error('[Admin Dashboard Fetch Error]', err);
      setError(err.response?.data?.message || 'Failed to load administrative statistics. Please check server connectivity.');
    } finally {
      setLoading(false);
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

  const statCards = [
    { label: 'Total Grievances', count: stats.total, type: 'total', icon: Layers },
    { label: 'Pending Action', count: stats.pending, type: 'pending', icon: Clock },
    { label: 'In Progress', count: stats.inProgress, type: 'inprogress', icon: Loader2 },
    { label: 'Resolved', count: stats.resolved, type: 'resolved', icon: CheckCircle2 },
    { label: 'Rejected', count: stats.rejected, type: 'rejected', icon: XCircle },
  ];

  return (
    <div className="page-content">
      {/* Header Banner */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
          color: 'white', 
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff' }}>
              <ShieldCheck size={14} color="#60a5fa" />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Administrative Console &bull; Live Operations</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
              Welcome, <span className="text-gradient-hero">{user?.name || 'Administrator'}</span> 👋
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              Portal Authority Session active &bull; Account: <strong style={{ color: '#cbd5e1' }}>{user?.email}</strong>
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onNavigate('admin-complaints')}
            style={{ fontSize: '0.95rem', padding: '0.8rem 1.5rem' }}
          >
            <Inbox size={18} />
            Manage All Grievances
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginBottom: '2rem' }}>
          <RefreshCw size={36} className="spin" color="#3b82f6" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.3rem' }}>
            Loading Administrative Analytics
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Aggregating complaint records and calculating portal statistics...
          </p>
        </div>
      )}

      {/* Error State with Retry */}
      {!loading && error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={22} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Unable to load dashboard data</strong>
              <span style={{ fontSize: '0.85rem' }}>{error}</span>
            </div>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={fetchDashboardData}
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Main Content (Happy Path) */}
      {!loading && !error && (
        <>
          {/* Urgent Attention Banner */}
          {stats.urgent > 0 && (
            <div 
              style={{ 
                background: '#fff1f2', 
                border: '1px solid #fecdd3', 
                borderRadius: '16px', 
                padding: '1rem 1.25rem', 
                marginBottom: '1.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={20} color="#e11d48" />
                <span style={{ fontSize: '0.92rem', color: '#9f1239', fontWeight: 600 }}>
                  Attention required: <strong>{stats.urgent} urgent grievance{stats.urgent > 1 ? 's' : ''}</strong> currently unresolved.
                </span>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => onNavigate('admin-complaints')}
                style={{ background: '#e11d48', color: '#ffffff', border: 'none' }}
              >
                Review Urgent Cases
              </button>
            </div>
          )}

          {/* 🔥 Room Hotspots Alert Banner */}
          {roomHotspots.length > 0 && (
            <div 
              style={{ 
                background: 'var(--accent-soft)', 
                border: '1.5px solid var(--accent)', 
                borderRadius: '16px', 
                padding: '1.1rem 1.25rem', 
                marginBottom: '1.75rem',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={20} color="var(--accent)" />
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    🔥 Room Maintenance Hotspot Warning ({roomHotspots.length} Rooms with Multiple Active Complaints)
                  </strong>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Multiple issues reported in single room
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {roomHotspots.map((hs, idx) => (
                  <div key={idx} style={{ background: 'var(--surface-raised)', padding: '0.65rem 0.95rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📍 <strong style={{ color: 'var(--text-main)' }}>{hs.blockLocation}</strong> &bull; <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{hs.roomNumber}</span></span>
                    <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '0.1rem 0.55rem', borderRadius: '999px' }}>
                      {hs.activeCount} Active Complaints
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {statCards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="stat-card">
                  <div className={`stat-icon ${item.type}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="stat-value">{item.count}</div>
                    <div className="stat-label">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category Distribution Breakdown */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Grievance Volume by Category
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Distribution of filed concerns across college departments
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {categoryCounts.map((catItem) => {
                const percentage = stats.total > 0 ? Math.round((catItem.count / stats.total) * 100) : 0;
                return (
                  <div key={catItem.category} style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {catItem.category}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {catItem.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${percentage}%`, 
                          background: percentage > 40 ? '#ef4444' : percentage > 20 ? '#f59e0b' : '#3b82f6' 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Grievances Across Campus */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Recent Campus Grievances
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Latest grievances submitted by enrolled students
                </p>
              </div>

              {recentComplaints.length > 0 && (
                <button
                  onClick={() => onNavigate('admin-complaints')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  View All Grievances
                  <ArrowRight size={16} />
                </button>
              )}
            </div>

            {recentComplaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--bg-subtle)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
                <Inbox size={42} color="var(--text-subtle)" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  No grievances in the database yet
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto' }}>
                  When students submit complaints through their portal, they will appear here in real time.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="complaint-table">
                  <thead>
                    <tr>
                      <th>Complaint ID</th>
                      <th>Student</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentComplaints.map((item) => (
                      <tr 
                        key={item._id} 
                        onClick={() => onNavigate('admin-complaints')}
                        title="Click to view in Grievance Management"
                      >
                        <td>
                          <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>
                            {item.complaintId}
                          </strong>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <User size={14} color="#64748b" />
                            <div>
                              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>
                                {item.studentName}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {item.studentEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: '#1e293b' }}>{item.title}</strong>
                        </td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#475569' }}>
                            <Tag size={13} color="#94a3b8" />
                            {item.category}
                          </span>
                        </td>
                        <td>
                          <span className={`priority-pill ${item.priority ? item.priority.replace(' ', '-') : 'Not-set'}`}>
                            {item.priority || 'Not set'}
                          </span>
                        </td>
                        <td style={{ color: '#64748b' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                            <Calendar size={13} color="#94a3b8" />
                            {formatDate(item.createdAt)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${item.status ? item.status.replace(' ', '-') : 'Pending'}`}>
                            &bull; {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;

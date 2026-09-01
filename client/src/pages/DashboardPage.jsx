import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import ComplaintModal from '../components/ComplaintModal';
import { getStatsApi, getMyComplaintsApi } from '../services/api';
import { PlusCircle, FileText, ArrowRight, ShieldCheck, Tag, Calendar } from 'lucide-react';

const DashboardPage = ({ user, onNavigate }) => {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await getStatsApi();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      const complaintsRes = await getMyComplaintsApi();
      if (complaintsRes.success) {
        setRecentComplaints(complaintsRes.complaints.slice(0, 5)); // Take latest 5
      }
    } catch (error) {
      console.error('Error fetching dashboard info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFirstName = (fullName) => {
    if (!fullName) return 'Student';
    return fullName.split(' ')[0];
  };

  const formatDate = (dateStr) => {
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
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
          color: 'white', 
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.15)' }}>
              <ShieldCheck size={14} color="#60a5fa" />
              <span>Student Grievance & Resolution System</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
              Welcome, {getFirstName(user?.name)} 👋
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Registered Email: <strong style={{ color: '#cbd5e1' }}>{user?.email}</strong>
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onNavigate('new-complaint')}
            style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
          >
            <PlusCircle size={20} />
            Raise a Complaint
          </button>
        </div>
      </div>

      {/* Stats Counter Section */}
      <StatsCard stats={stats} />

      {/* Recent Complaints Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Grievances</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Overview of your latest submitted concerns</p>
          </div>

          {recentComplaints.length > 0 && (
            <button
              onClick={() => onNavigate('my-complaints')}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              View All Complaints
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Loading your grievance records...
          </div>
        ) : recentComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <FileText size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              No complaints yet. Raise your first complaint.
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
              Have an issue with hostel, academics, faculty or campus infrastructure? Submit your grievance for fast resolution.
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate('new-complaint')}>
              <PlusCircle size={18} />
              Submit Grievance
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((item) => (
                  <tr key={item._id} onClick={() => setSelectedComplaint(item)}>
                    <td>
                      <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{item.complaintId}</strong>
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
                    <td style={{ color: '#64748b' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                        <Calendar size={13} color="#94a3b8" />
                        {formatDate(item.createdAt)}
                      </span>
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

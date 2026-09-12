import React, { useState, useEffect } from 'react';
import ComplaintModal from '../components/ComplaintModal';
import { getMyComplaintsApi } from '../services/api';
import { FileText, PlusCircle, Search, Tag, Calendar, Filter } from 'lucide-react';

const MyComplaintsPage = ({ onNavigate, initialStatusFilter = 'All' }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(initialStatusFilter || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getMyComplaintsApi();
      if (res.success) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              My Complaints <span className="text-gradient">History</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Track and review all grievances submitted under your account</p>
          </div>

          <button className="btn btn-primary" onClick={() => onNavigate('new-complaint')}>
            <PlusCircle size={18} />
            New Complaint
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem', height: '38px', fontSize: '0.88rem' }}
              placeholder="Search by ID, title, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Status:</span>
            {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: filterStatus === status ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: filterStatus === status ? 'var(--gradient-btn)' : 'var(--bg-subtle)',
                  color: filterStatus === status ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Loading your grievance history...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--bg-subtle)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            <FileText size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              {complaints.length === 0 ? 'No complaints yet. Raise your first complaint.' : 'No complaints match your filter criteria.'}
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {complaints.length === 0 ? 'Submit an official grievance to start tracking resolution progress.' : 'Try adjusting your search keyword or status filter.'}
            </p>
            {complaints.length === 0 && (
              <button className="btn btn-primary" onClick={() => onNavigate('new-complaint')}>
                <PlusCircle size={18} />
                Submit Grievance
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((item) => (
                  <tr key={item._id} onClick={() => setSelectedComplaint(item)}>
                    <td>
                      <strong style={{ color: 'var(--primary)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                        {item.complaintId}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{item.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                        {item.description}
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Tag size={13} color="var(--text-subtle)" />
                        {item.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                        <Calendar size={13} color="var(--text-subtle)" />
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

      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
};

export default MyComplaintsPage;

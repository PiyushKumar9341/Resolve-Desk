import React, { useState, useEffect } from 'react';
import { getAdminComplaintsApi, updateComplaintAdminApi } from '../../services/api';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Tag, 
  Calendar, 
  User, 
  RefreshCw, 
  AlertCircle, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  X,
  CheckCircle2,
  Clock,
  Send,
  Building,
  UserCheck,
  MessageSquare,
  History,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const AdminComplaintsPage = ({ onNavigate, onSelectComplaint }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Query Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Detail Modal & Action Form State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  const [formStatus, setFormStatus] = useState('');
  const [formPriority, setFormPriority] = useState('');
  const [formAdminRemark, setFormAdminRemark] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formAssignedStaff, setFormAssignedStaff] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [filterStatus, filterCategory, filterPriority, sortBy, sortOrder, page]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchComplaints();
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminComplaintsApi({
        search: searchTerm,
        status: filterStatus,
        category: filterCategory,
        priority: filterPriority,
        sortBy,
        sortOrder,
        page,
        limit: 10
      });

      if (data.success) {
        setComplaints(data.complaints || []);
        setTotalPages(data.totalPages || 1);
        setTotalRecords(data.total || 0);
      }
    } catch (err) {
      console.error('[Admin Complaints Fetch Error]', err);
      setError(err.response?.data?.message || 'Failed to load grievance records. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setFilterCategory('All');
    setFilterPriority('All');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openReviewModal = (complaint) => {
    setSelectedComplaint(complaint);
    setFormStatus(complaint.status || 'Pending');
    setFormPriority(complaint.priority || 'Medium');
    setFormAdminRemark(complaint.adminRemark || '');
    setFormDepartment(complaint.department || '');
    setFormAssignedStaff(complaint.assignedStaff || '');
    setUpdateMessage({ type: '', text: '' });

    if (onSelectComplaint) {
      onSelectComplaint(complaint);
    }
  };

  const closeReviewModal = () => {
    setSelectedComplaint(null);
    setUpdateMessage({ type: '', text: '' });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setUpdating(true);
    setUpdateMessage({ type: '', text: '' });

    try {
      const data = await updateComplaintAdminApi(selectedComplaint._id, {
        status: formStatus,
        priority: formPriority,
        adminRemark: formAdminRemark,
        department: formDepartment,
        assignedStaff: formAssignedStaff
      });

      if (data.success) {
        setUpdateMessage({ type: 'success', text: data.message || 'Grievance updated successfully.' });
        setSelectedComplaint(data.complaint);

        // Update item in local list state
        setComplaints((prevList) =>
          prevList.map((item) => (item._id === data.complaint._id ? data.complaint : item))
        );
      }
    } catch (err) {
      console.error('[Admin Update Complaint Error]', err);
      setUpdateMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update grievance record.'
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="page-content">
      {/* Title Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Campus Grievance Management
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Search, filter, prioritize, and manage complaints filed across all departments
            </p>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, background: '#eff6ff', color: '#2563eb', padding: '0.4rem 0.9rem', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
            {totalRecords} Total Grievances
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-toolbar">
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.88rem' }}
            placeholder="Search by ID, title, student name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="admin-filters">
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            title="Filter by Status"
          >
            <option value="All">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select 
            className="filter-select"
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            title="Filter by Category"
          >
            <option value="All">Category: All</option>
            <option value="Hostel">Hostel</option>
            <option value="Academic">Academic</option>
            <option value="Faculty">Faculty</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Other">Other</option>
          </select>

          <select 
            className="filter-select"
            value={filterPriority}
            onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }}
            title="Filter by Priority"
          >
            <option value="All">Priority: All</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            className="filter-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb);
              setSortOrder(so);
              setPage(1);
            }}
            title="Sort Complaints"
          >
            <option value="createdAt-desc">Sort: Newest First</option>
            <option value="createdAt-asc">Sort: Oldest First</option>
            <option value="priority-desc">Sort: Priority (Urgent to Low)</option>
            <option value="priority-asc">Sort: Priority (Low to Urgent)</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchComplaints}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Complaints Table Card */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
            <RefreshCw size={32} className="spin" color="#3b82f6" style={{ margin: '0 auto 1rem auto' }} />
            <div>Loading grievances from database...</div>
          </div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
            <FileText size={48} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
              No grievances match current filters
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Try loosening your search keywords or resetting status/priority filters.
            </p>
            <button className="btn btn-secondary" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Student Details</th>
                    <th>Title & Description</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>
                          {item.complaintId}
                        </strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <User size={15} color="#64748b" />
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
                        <div style={{ maxWidth: '280px' }}>
                          <strong style={{ color: '#1e293b', display: 'block', fontSize: '0.9rem' }}>
                            {item.title}
                          </strong>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.description}
                          </div>
                        </div>
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
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-action"
                          onClick={() => openReviewModal(item)}
                          title="Review grievance details"
                        >
                          <Eye size={14} /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-bar">
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalRecords} total records)
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="pagination-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  className="pagination-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Complaint Detail & Admin Action Modal */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={closeReviewModal}>
          <div 
            className="modal-content modal-lg" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb', fontFamily: 'monospace' }}>
                    {selectedComplaint.complaintId}
                  </span>
                  <span className={`priority-pill ${selectedComplaint.priority ? selectedComplaint.priority.replace(' ', '-') : 'Not-set'}`}>
                    {selectedComplaint.priority || 'Not set'}
                  </span>
                  <span className={`badge ${selectedComplaint.status ? selectedComplaint.status.replace(' ', '-') : 'Pending'}`}>
                    &bull; {selectedComplaint.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                  {selectedComplaint.title}
                </h3>
              </div>
              <button 
                onClick={closeReviewModal}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Notification alert */}
            {updateMessage.text && (
              <div 
                className={`alert ${updateMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}
                style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
              >
                {updateMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{updateMessage.text}</span>
              </div>
            )}

            {/* Grievance Details Summary Grid */}
            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Filed By Student
                  </span>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.92rem', marginTop: '0.15rem' }}>
                    {selectedComplaint.studentName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {selectedComplaint.studentEmail}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Category & Department
                  </span>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.92rem', marginTop: '0.15rem' }}>
                    {selectedComplaint.category}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {selectedComplaint.department || 'Department not assigned'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Timestamps
                  </span>
                  <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '0.15rem' }}>
                    <strong>Filed:</strong> {formatDateTime(selectedComplaint.createdAt)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    <strong>Updated:</strong> {formatDateTime(selectedComplaint.updatedAt)}
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                  Grievance Description
                </span>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginTop: '0.3rem', background: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', whiteSpace: 'pre-wrap' }}>
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            {/* Admin Actions Form */}
            <form onSubmit={handleUpdateSubmit} style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="#2563eb" />
                Administrative Actions & Resolution Controls
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Status Selector */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Update Status</label>
                  <select 
                    className="form-input" 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    style={{ fontWeight: 600 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Assign Priority</label>
                  <select 
                    className="form-input" 
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    style={{ fontWeight: 600 }}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Priority</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Department Input */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Hostel Maintenance, Exam Cell"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                  />
                </div>

                {/* Assigned Staff Input */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Assigned Staff Officer</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dr. K. Sharma (Warden)"
                    value={formAssignedStaff}
                    onChange={(e) => setFormAssignedStaff(e.target.value)}
                  />
                </div>
              </div>

              {/* Admin Remark Textarea */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Official Admin Remark / Resolution Note</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Enter official action taken, resolution summary, or rejection reason..."
                  value={formAdminRemark}
                  onChange={(e) => setFormAdminRemark(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeReviewModal}
                  disabled={updating}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updating}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {updating ? (
                    <>
                      <RefreshCw size={16} className="spin" /> Updating...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Save Administrative Updates
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Status History Timeline */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={18} color="#64748b" />
                Audit Trail & Status History Timeline
              </h4>

              {(!selectedComplaint.statusHistory || selectedComplaint.statusHistory.length === 0) ? (
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', color: '#64748b', fontSize: '0.88rem', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                  No previous status changes recorded for this grievance.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedComplaint.statusHistory.slice().reverse().map((hist, idx) => (
                    <div key={idx} className="timeline-body">
                      <div className="timeline-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`badge ${hist.status ? hist.status.replace(' ', '-') : 'Pending'}`}>
                            &bull; {hist.status}
                          </span>
                          <span style={{ fontWeight: 600, color: '#475569' }}>
                            Changed by: {hist.changedBy?.name || hist.changedBy?.email || hist.changedBy || 'Admin'}
                          </span>
                        </div>
                        <span>{formatDateTime(hist.changedAt)}</span>
                      </div>
                      {hist.remark && (
                        <div className="timeline-text" style={{ fontStyle: 'italic', marginTop: '0.25rem' }}>
                          "{hist.remark}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsPage;

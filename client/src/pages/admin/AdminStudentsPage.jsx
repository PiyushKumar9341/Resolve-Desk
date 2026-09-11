import React, { useState, useEffect } from 'react';
import { getStudentsAdminApi, getStudentDetailsAdminApi } from '../../services/api';
import { 
  Users, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  User, 
  Eye, 
  X, 
  Tag, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  GraduationCap,
  Inbox
} from 'lucide-react';

const AdminStudentsPage = ({ onNavigate, onSelectComplaint }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Student Detail Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentComplaints, setStudentComplaints] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [page]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchStudents();
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStudentsAdminApi({
        search: searchTerm,
        page,
        limit: 10
      });

      if (data.success) {
        setStudents(data.students || []);
        setTotalPages(data.totalPages || 1);
        setTotalRecords(data.total || 0);
      }
    } catch (err) {
      console.error('[Admin Students Fetch Error]', err);
      setError(err.response?.data?.message || 'Failed to load student directory. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const openStudentModal = async (studentId) => {
    setLoadingDetail(true);
    setDetailError('');
    setSelectedStudent(null);
    setStudentComplaints([]);

    try {
      const data = await getStudentDetailsAdminApi(studentId);
      if (data.success) {
        setSelectedStudent(data.student);
        setStudentComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error('[Admin Student Details Fetch Error]', err);
      setDetailError(err.response?.data?.message || 'Failed to load student complaint history.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeStudentModal = () => {
    setSelectedStudent(null);
    setStudentComplaints([]);
    setDetailError('');
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
      {/* Title Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Enrolled Student Directory
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Search registered college students, view filed grievances, and inspect complaint histories
            </p>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, background: '#f0f9ff', color: '#0284c7', padding: '0.4rem 0.9rem', borderRadius: '20px', border: '1px solid #bae6fd' }}>
            {totalRecords} Enrolled Students
          </div>
        </div>
      </div>

      {/* Toolbar / Search Bar */}
      <div className="admin-toolbar" style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.88rem' }}
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" onClick={fetchStudents} title="Refresh directory">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchStudents}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Student List Table */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
            <RefreshCw size={32} className="spin" color="#0284c7" style={{ margin: '0 auto 1rem auto' }} />
            <div>Loading student directory...</div>
          </div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
            <Users size={48} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
              No students found
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Try broadening your search query or reset search keywords.
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Joined Date</th>
                    <th>Total Complaints</th>
                    <th>Breakdown (P / IP / R / Rej)</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const stats = student.complaintStats || { total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 };
                    return (
                      <tr key={student._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div className="avatar" style={{ background: '#e0f2fe', color: '#0369a1', width: '32px', height: '32px', fontSize: '0.85rem' }}>
                              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <strong style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                              {student.name || 'Student'}
                            </strong>
                          </div>
                        </td>
                        <td style={{ color: '#475569', fontSize: '0.88rem' }}>
                          {student.email}
                        </td>
                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {formatDate(student.createdAt)}
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: stats.total > 0 ? '#2563eb' : '#64748b', fontSize: '0.9rem' }}>
                            {stats.total} Grievance{stats.total === 1 ? '' : 's'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.75rem' }}>
                            <span style={{ background: '#fffbeb', color: '#b45309', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }} title="Pending">
                              P: {stats.pending}
                            </span>
                            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }} title="In Progress">
                              IP: {stats.inProgress}
                            </span>
                            <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }} title="Resolved">
                              R: {stats.resolved}
                            </span>
                            {stats.rejected > 0 && (
                              <span style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }} title="Rejected">
                                Rej: {stats.rejected}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-action"
                            onClick={() => openStudentModal(student._id)}
                            title="View student history & grievances"
                          >
                            <Eye size={14} /> History
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-bar">
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalRecords} students)
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

      {/* Student Profile & Complaint History Modal */}
      {(selectedStudent || loadingDetail || detailError) && (
        <div className="modal-overlay" onClick={closeReviewModal}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <GraduationCap size={24} color="#0284c7" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  Student Profile & Grievance History
                </h3>
              </div>
              <button onClick={closeStudentModal} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            {loadingDetail && (
              <div style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                <RefreshCw size={32} className="spin" color="#0284c7" style={{ margin: '0 auto 1rem auto' }} />
                <div>Fetching student profile records...</div>
              </div>
            )}

            {detailError && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                {detailError}
              </div>
            )}

            {selectedStudent && !loadingDetail && (
              <>
                {/* Student Info Card */}
                <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #bae6fd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0369a1', marginBottom: '0.2rem' }}>
                        {selectedStudent.name}
                      </h4>
                      <div style={{ color: '#0284c7', fontSize: '0.9rem', fontWeight: 600 }}>
                        {selectedStudent.email}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                        Registered since {formatDate(selectedStudent.createdAt)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ background: '#ffffff', padding: '0.6rem 1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb' }}>
                          {selectedStudent.complaintStats?.total || 0}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                          Total Filed
                        </div>
                      </div>

                      <div style={{ background: '#ffffff', padding: '0.6rem 1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                          {selectedStudent.complaintStats?.resolved || 0}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                          Resolved
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grievances Submitted by Student */}
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                  Grievances Submitted ({studentComplaints.length})
                </h4>

                {studentComplaints.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <Inbox size={40} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      This student has not submitted any complaints yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="complaint-table">
                      <thead>
                        <tr>
                          <th>Complaint ID</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentComplaints.map((c) => (
                          <tr key={c._id}>
                            <td>
                              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>
                                {c.complaintId}
                              </strong>
                            </td>
                            <td>
                              <strong style={{ color: '#1e293b' }}>{c.title}</strong>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                                {c.category}
                              </span>
                            </td>
                            <td>
                              <span className={`priority-pill ${c.priority ? c.priority.replace(' ', '-') : 'Not-set'}`}>
                                {c.priority || 'Not set'}
                              </span>
                            </td>
                            <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                              {formatDate(c.createdAt)}
                            </td>
                            <td>
                              <span className={`badge ${c.status ? c.status.replace(' ', '-') : 'Pending'}`}>
                                &bull; {c.status}
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
      )}
    </div>
  );
};

export default AdminStudentsPage;

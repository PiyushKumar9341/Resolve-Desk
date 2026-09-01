import React from 'react';
import { X, Calendar, Tag, AlertCircle, MessageSquare } from 'lucide-react';

const ComplaintModal = ({ complaint, onClose }) => {
  if (!complaint) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.5px' }}>
              {complaint.complaintId}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.2rem' }}>
              {complaint.title}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
            <Tag size={16} />
            <strong style={{ color: '#1e293b' }}>Category:</strong> {complaint.category}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
            <Calendar size={16} />
            <strong style={{ color: '#1e293b' }}>Date:</strong> {formatDate(complaint.createdAt)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className={`badge ${complaint.status.replace(' ', '-')}`}>
              ● {complaint.status}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={16} color="#2563eb" />
            Description
          </h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {complaint.description}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MessageSquare size={16} color="#4f46e5" />
            Admin Remarks
          </h4>
          <div style={{ background: complaint.adminRemark ? '#f5f3ff' : '#f8fafc', padding: '1rem', borderRadius: '12px', border: complaint.adminRemark ? '1px solid #ddd6fe' : '1px solid #e2e8f0', fontSize: '0.9rem', color: complaint.adminRemark ? '#4338ca' : '#94a3b8', fontStyle: complaint.adminRemark ? 'normal' : 'italic' }}>
            {complaint.adminRemark || 'No official admin remark attached to this grievance yet.'}
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;

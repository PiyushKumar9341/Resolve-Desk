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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px' }}>
              {complaint.complaintId}
            </span>
            <h3 className="modal-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.2rem' }}>
              {complaint.title}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="modal-close-btn"
            style={{ borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Tag size={16} />
            <strong style={{ color: 'var(--text-main)' }}>Category:</strong> {complaint.category}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--primary)', background: 'var(--primary-soft)', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-accent)', fontWeight: 700 }}>
            <span>📍 {complaint.blockLocation || 'Campus'} {complaint.floorLocation ? `• ${complaint.floorLocation}` : ''} {complaint.roomNumber ? `• ${complaint.roomNumber}` : ''}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Calendar size={16} />
            <strong style={{ color: 'var(--text-main)' }}>Date:</strong> {formatDate(complaint.createdAt)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className={`badge ${complaint.status.replace(' ', '-')}`}>
              ● {complaint.status}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={16} color="var(--primary)" />
            Description
          </h4>
          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {complaint.description}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MessageSquare size={16} color="var(--primary)" />
            Admin Remarks
          </h4>
          <div style={{ background: complaint.adminRemark ? 'var(--primary-soft)' : 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: complaint.adminRemark ? '1px solid var(--border-accent)' : '1px solid var(--border)', fontSize: '0.9rem', color: complaint.adminRemark ? 'var(--primary)' : 'var(--text-subtle)', fontStyle: complaint.adminRemark ? 'normal' : 'italic' }}>
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

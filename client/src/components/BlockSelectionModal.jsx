import React from 'react';
import { MapPin, Building, GraduationCap, Utensils, Home, Sparkles, X, CheckCircle2 } from 'lucide-react';

const GCET_BLOCKS = [
  { id: 'Block A', label: 'Block A', icon: Building },
  { id: 'Block B', label: 'Block B', icon: Building },
  { id: 'Block C', label: 'Block C', icon: Building },
  { id: 'Block D', label: 'Block D', icon: Building },
  { id: 'GBS Block', label: 'GBS Block', icon: GraduationCap },
  { id: 'Main Canteen / Food Court', label: 'Main Canteen', icon: Utensils },
  { id: 'Hostel Block', label: 'Hostel Block', icon: Home },
  { id: 'Sports Complex / Ground', label: 'Sports Complex', icon: Sparkles },
  { id: 'Other', label: 'Other Location', icon: MapPin },
];

const BlockSelectionModal = ({ selectedBlock, onSelectBlock, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(226, 232, 240, 0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <MapPin size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Select Campus Location / Block
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Choose your building to view & submit block grievances
              </p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} color="#64748b" />
            </button>
          )}
        </div>

        {/* Clean Block Selection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
          {GCET_BLOCKS.map((blk) => {
            const Icon = blk.icon;
            const isSelected = selectedBlock === blk.id;

            return (
              <button
                key={blk.id}
                type="button"
                className={`block-card-option ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectBlock(blk.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: isSelected ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : '#ffffff',
                  color: isSelected ? '#1e40af' : '#334155',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 6px 16px rgba(37, 99, 235, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <Icon size={18} color={isSelected ? '#2563eb' : '#64748b'} />
                <span>{blk.label}</span>
                {isSelected && <CheckCircle2 size={16} color="#2563eb" style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={onClose || (() => {})}
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', borderRadius: '14px' }}
          >
            Continue to Dashboard ({selectedBlock})
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockSelectionModal;

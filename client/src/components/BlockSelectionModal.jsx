import React, { useState } from 'react';
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
  // Local draft state so background page stays 100% frozen until user clicks Confirm
  const [tempBlock, setTempBlock] = useState(selectedBlock || 'Block A');

  const handleConfirm = () => {
    onSelectBlock(tempBlock);
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', background: 'var(--primary-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid var(--border-accent)' }}>
              <MapPin size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Select Campus Location / <span className="text-gradient">Block</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Choose your building to view & submit block grievances
              </p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="modal-close-btn"
              style={{ 
                borderRadius: '50%', 
                width: '34px', 
                height: '34px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer' 
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Translucent Frosted Glass Block Selection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
          {GCET_BLOCKS.map((blk) => {
            const Icon = blk.icon;
            const isSelected = tempBlock === blk.id;

            return (
              <button
                key={blk.id}
                type="button"
                className={`block-card-option ${isSelected ? 'selected' : ''}`}
                onClick={() => setTempBlock(blk.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isSelected 
                    ? 'var(--primary-soft)' 
                    : 'var(--bg-subtle)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 8px 20px var(--primary-glow)' : 'var(--shadow-sm)'
                }}
              >
                <Icon size={18} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>{blk.label}</span>
                {isSelected && <CheckCircle2 size={16} color="var(--primary)" style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', borderRadius: '14px' }}
          >
            Confirm & Enter {tempBlock}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockSelectionModal;

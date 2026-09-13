import React, { useState } from 'react';
import { MapPin, Building, GraduationCap, Utensils, Home, Sparkles, X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const GCET_BLOCKS = [
  { id: 'Block A', label: 'Block A', icon: Building },
  { id: 'Block B', label: 'Block B', icon: Building },
  { id: 'Block C', label: 'Block C', icon: Building },
  { id: 'Block D', label: 'Block D', icon: Building },
  { id: 'GBS Block', label: 'GBS Block', icon: GraduationCap },
  { id: 'Main Canteen / Food Court', label: 'Main Canteen', icon: Utensils },
  { id: 'Boys Hostel', label: 'Boys Hostel', icon: Home },
  { id: 'Girls Hostel', label: 'Girls Hostel', icon: Home },
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
    <div className="modal-overlay block-modal-overlay">
      <div className="modal-content block-selection-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header matching Navbar Brand Pill */}
        <div className="block-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              className="brand-logo-badge"
              style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-teal) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px var(--primary-glow)',
                flexShrink: 0
              }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--primary-soft)', padding: '0.15rem 0.55rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem', border: '1px solid var(--border-accent)' }}>
                <ShieldCheck size={12} />
                <span>Session Campus Verification</span>
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Select Campus <span className="text-gradient">Block / Location</span>
              </h3>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="modal-close-btn"
              title="Close & use current location"
              style={{ 
                borderRadius: '50%', 
                width: '34px', 
                height: '34px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500 }}>
          Welcome! Please choose your campus location to load active block grievances and raise new issues:
        </p>

        {/* Translucent Navbar-Styled Block Options Grid */}
        <div className="block-selection-grid">
          {GCET_BLOCKS.map((blk) => {
            const Icon = blk.icon;
            const isSelected = tempBlock === blk.id;

            return (
              <button
                key={blk.id}
                type="button"
                className={`block-card-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setTempBlock(blk.id)}
              >
                <div className="block-icon-wrapper">
                  <Icon size={18} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                </div>
                <span className="block-card-title">{blk.label}</span>
                {isSelected && (
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
                )}
              </button>
            );
          })}
        </div>

        <div className="block-modal-footer">
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            style={{ 
              width: '100%', 
              padding: '0.8rem 1.25rem', 
              fontSize: '0.95rem', 
              borderRadius: '14px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px var(--primary-glow)'
            }}
          >
            <span>Confirm & Enter {tempBlock}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockSelectionModal;

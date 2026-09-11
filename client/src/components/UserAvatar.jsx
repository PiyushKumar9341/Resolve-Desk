import React, { useState } from 'react';

/**
 * Returns a crisp profile picture URL generated dynamically from user's email or name
 */
export const getUserAvatarUrl = (user) => {
  if (user?.avatar) return user.avatar;
  const nameOrEmail = user?.name || user?.email || 'Student';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOrEmail)}&background=2563eb&color=ffffff&bold=true&length=2&size=128`;
};

const UserAvatar = ({ user, size = 40, style = {}, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = getUserAvatarUrl(user);
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'S';

  return (
    <div 
      className={`user-avatar-badge ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        color: '#ffffff',
        fontWeight: 800,
        fontSize: `${Math.max(12, size * 0.42)}px`,
        border: '2px solid var(--border-accent)',
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
        position: 'relative',
        userSelect: 'none',
        ...style
      }}
    >
      {!imgError && avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={user?.name || 'User Avatar'} 
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};

export default UserAvatar;

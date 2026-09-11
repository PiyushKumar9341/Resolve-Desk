import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ThumbsUp, 
  FileText, 
  Check, 
  Trash2, 
  Bell, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getNotificationIcon(type, title = '') {
  const lowerTitle = title.toLowerCase();
  if (type === 'upvote' || lowerTitle.includes('upvote')) {
    return <ThumbsUp size={16} color="#6366f1" />;
  }
  if (lowerTitle.includes('resolved') || lowerTitle.includes('completed')) {
    return <CheckCircle2 size={16} color="#10b981" />;
  }
  if (lowerTitle.includes('in progress')) {
    return <Clock size={16} color="#f59e0b" />;
  }
  if (lowerTitle.includes('rejected')) {
    return <AlertTriangle size={16} color="#ef4444" />;
  }
  if (type === 'remark') {
    return <MessageSquare size={16} color="#8b5cf6" />;
  }
  return <FileText size={16} color="#3b82f6" />;
}

const NotificationDropdown = ({ 
  notifications = [], 
  unreadCount = 0, 
  onMarkRead, 
  onMarkAllRead, 
  onDeleteNotif,
  onClose 
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const filteredNotifs = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  return (
    <div className="notif-dropdown-card">
      {/* Header */}
      <div className="notif-dropdown-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={16} color="var(--primary)" />
          <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Notifications
          </h4>
          {unreadCount > 0 && (
            <span className="notif-unread-badge">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button 
            type="button"
            className="notif-action-btn"
            onClick={onMarkAllRead}
            title="Mark all notifications as read"
          >
            <Check size={13} /> Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="notif-dropdown-tabs">
        <button 
          type="button" 
          className={`notif-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          type="button" 
          className={`notif-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      <div className="notif-dropdown-list">
        {filteredNotifs.length === 0 ? (
          <div className="notif-empty-state">
            <Sparkles size={28} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div 
              key={notif._id}
              className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
              onClick={() => {
                if (!notif.isRead) onMarkRead(notif._id);
              }}
            >
              <div className="notif-icon-box">
                {getNotificationIcon(notif.type, notif.title)}
              </div>

              <div className="notif-content">
                <div className="notif-title-row">
                  <span className="notif-title">{notif.title}</span>
                  <span className="notif-time">{formatTimeAgo(notif.createdAt)}</span>
                </div>
                <p className="notif-message">{notif.message}</p>
              </div>

              {!notif.isRead && <span className="notif-dot" title="Unread" />}

              <button 
                type="button"
                className="notif-delete-btn"
                title="Delete notification"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNotif(notif._id);
                }}
              >
                <Trash2 size={13} color="var(--text-muted)" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

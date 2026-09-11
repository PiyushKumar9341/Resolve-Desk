import React, { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import NotificationDropdown from './NotificationDropdown';
import { 
  getNotificationsApi, 
  markNotificationReadApi, 
  markAllNotificationsReadApi, 
  deleteNotificationApi 
} from '../services/api';
import { 
  Bell, 
  ShieldCheck, 
  Menu, 
  Sun, 
  Moon, 
  LogOut, 
  GraduationCap,
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  Users,
  BarChart3,
  AlertTriangle,
  X
} from 'lucide-react';

const Navbar = ({ user, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, onLogout, onNavigate }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('skillnexis-theme') || 'dark';
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const prevUnreadRef = React.useRef(null);

  // Synthesize crisp iOS/macOS style notification chime ("tuun" sound)
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Smooth chime sound (D5 587Hz -> A5 880Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.38);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // Trigger System Native OS Banner Notification (Works on Android Phone / Desktop Notification Center)
  const showNativeBannerNotification = (notif) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const title = notif?.title || 'Galgotias Resolve Desk Alert';
    const body = notif?.message || 'You have a new grievance status update.';

    try {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            vibrate: [200, 100, 200],
            tag: notif?._id || 'resolve-desk-notif'
          });
        });
      } else {
        new Notification(title, { body, icon: '/favicon.ico' });
      }
    } catch (err) {
      console.error('[Native Notification Error]', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsApi();
      if (res && res.success) {
        const newUnread = res.unreadCount || 0;
        const fetchedNotifs = res.notifications || [];

        // Play chime sound & trigger Native Phone Push Banner if new unread notification arrived
        if (prevUnreadRef.current !== null && newUnread > prevUnreadRef.current) {
          playNotificationChime();
          const latestUnread = fetchedNotifs.find((n) => !n.isRead);
          if (latestUnread) {
            showNativeBannerNotification(latestUnread);
          }
        }
        prevUnreadRef.current = newUnread;

        setNotifications(fetchedNotifs);
        setUnreadNotifCount(newUnread);
      }
    } catch (err) {
      console.error('[Fetch Notifications Error]', err);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skillnexis-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000); // 20s polling
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showNotifDropdown && !e.target.closest('.notif-dropdown-card') && !e.target.closest('.nav-icon-badge')) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifDropdown]);

  const handleMarkRead = async (id) => {
    try {
      const res = await markNotificationReadApi(id);
      if (res && res.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadNotifCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('[Mark Read Error]', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationsReadApi();
      if (res && res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadNotifCount(0);
      }
    } catch (err) {
      console.error('[Mark All Read Error]', err);
    }
  };

  const handleDeleteNotif = async (id) => {
    try {
      const res = await deleteNotificationApi(id);
      if (res && res.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        setUnreadNotifCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('[Delete Notif Error]', err);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const getInitial = (name) => {
    if (!name) return 'S';
    return name.charAt(0).toUpperCase();
  };

  const isAdmin = user?.role === 'admin';

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-complaint', label: 'New Complaint', icon: PlusCircle },
    { id: 'my-complaints', label: 'My Complaints', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-complaints', label: 'Grievances', icon: FileText },
    { id: 'admin-students', label: 'Students', icon: Users },
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Admin Profile', icon: User },
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  const handleSelectTab = (tabId) => {
    if (setActiveTab) setActiveTab(tabId);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="top-navbar">
        {/* Brand & Mobile Hamburger */}
        <div className="nav-brand-section">
          {setMobileMenuOpen && (
            <button 
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <Menu size={22} color="var(--text-main)" />
            </button>
          )}

          <div className="brand-logo-badge" style={isAdmin ? { background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--primary-dark) 100%)' } : { background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-teal) 100%)' }}>
            {isAdmin ? <ShieldCheck size={20} /> : <GraduationCap size={20} />}
          </div>
          <div className="portal-header-title">
            <span className="brand-text-main">{isAdmin ? 'Galgotias Admin Console' : 'Galgotias Resolve Desk'}</span>
            <span className="brand-text-sub">{isAdmin ? 'Authority Governance' : 'Galgotias Grievance Portal'}</span>
          </div>
        </div>

        {/* Center Horizontal Navigation Tabs */}
        <nav className="center-nav-tabs">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`top-nav-tab ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectTab(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Theme, Notifications, Profile & Logout */}
        <div className="user-badge" style={{ gap: '0.65rem' }}>
          {/* Sun/Moon Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <div 
              className="nav-icon-badge" 
              title="Notifications"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            >
              <Bell size={18} color={unreadNotifCount > 0 ? "var(--primary)" : "var(--text-muted)"} />
              {unreadNotifCount > 0 && (
                <span className="nav-unread-dot">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              )}
            </div>

            {showNotifDropdown && (
              <NotificationDropdown 
                notifications={notifications}
                unreadCount={unreadNotifCount}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                onDeleteNotif={handleDeleteNotif}
                onClose={() => setShowNotifDropdown(false)}
              />
            )}
          </div>
          
          {/* Top-Right Profile Pill & Logout Group */}
          <div className="nav-user-container">
            <div 
              className="nav-user-pill"
              onClick={() => handleSelectTab('profile')}
              title={`View Profile (${user?.email || ''})`}
            >
              <UserAvatar user={user} size={34} />
              <div className="user-info-text">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="user-name" title={user?.name}>
                    {user?.name || (user?.role === 'admin' ? 'Administrator' : 'Student')}
                  </span>
                  {user?.role === 'admin' && (
                    <span className="admin-badge">
                      ADMIN
                    </span>
                  )}
                </div>
                <span className="user-email" title={user?.email}>
                  {user?.email || 'user@college.edu'}
                </span>
              </div>
            </div>

            {/* Top-Right Logout Button (triggers confirmation modal) */}
            {onLogout && (
              <button
                type="button"
                className="top-logout-btn"
                onClick={() => setShowLogoutModal(true)}
                title="Logout from portal"
              >
                <LogOut size={16} />
                <span className="logout-text">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <span>Navigation Menu</span>
              <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>
            <div className="mobile-nav-body">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectTab(item.id)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-backdrop" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content logout-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-header">
              <div className="logout-icon-wrapper">
                <AlertTriangle size={28} color="var(--danger)" />
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowLogoutModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="logout-modal-body">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to log out of your session on <strong>Galgotias Resolve Desk</strong>?</p>
            </div>

            <div className="logout-modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

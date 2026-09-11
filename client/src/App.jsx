import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CampusFeedPage from './pages/CampusFeedPage';
import NewComplaintPage from './pages/NewComplaintPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { getProfileApi } from './services/api';

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role === 'admin') return 'admin-dashboard';
      } catch (e) {}
    }
    return 'dashboard';
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [selectedBlockForForm, setSelectedBlockForForm] = useState('Block A');

  const handleNavigate = (tab, payload) => {
    if (payload) {
      setSelectedBlockForForm(payload);
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    if (token) {
      // Validate session and refresh user details from server
      setLoadingProfile(true);
      getProfileApi()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
        .catch((err) => {
          console.error('[Session Check Failed]', err);
          handleLogout();
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
  }, [token]);

  // Adjust active tab if user role changes or tab does not match role
  useEffect(() => {
    if (user) {
      if (user.role === 'admin' && activeTab === 'dashboard') {
        setActiveTab('admin-dashboard');
      } else if (user.role !== 'admin' && activeTab.startsWith('admin-')) {
        setActiveTab('dashboard');
      }
    }
  }, [user, activeTab]);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setActiveTab(userData.role === 'admin' ? 'admin-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActiveTab('dashboard');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (!token || !user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (loadingProfile) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#2563eb', fontWeight: 600 }}>
        Loading Grievance Portal...
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="app-container">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        <Navbar user={user} />

        {/* Admin Navigation Views */}
        {isAdmin && activeTab === 'admin-dashboard' && (
          <AdminDashboardPage user={user} onNavigate={handleNavigate} />
        )}

        {isAdmin && activeTab === 'admin-complaints' && (
          <AdminComplaintsPage onNavigate={handleNavigate} />
        )}

        {isAdmin && activeTab === 'admin-students' && (
          <AdminStudentsPage onNavigate={handleNavigate} />
        )}

        {isAdmin && activeTab === 'admin-analytics' && (
          <AdminAnalyticsPage onNavigate={handleNavigate} />
        )}

        {/* Student Navigation Views */}
        {!isAdmin && activeTab === 'dashboard' && (
          <DashboardPage user={user} onNavigate={handleNavigate} />
        )}

        {!isAdmin && activeTab === 'campus-feed' && (
          <CampusFeedPage onNavigate={handleNavigate} />
        )}

        {!isAdmin && activeTab === 'new-complaint' && (
          <NewComplaintPage onNavigate={handleNavigate} selectedBlock={selectedBlockForForm} />
        )}

        {!isAdmin && activeTab === 'my-complaints' && (
          <MyComplaintsPage onNavigate={handleNavigate} />
        )}

        {/* Shared Profile View */}
        {activeTab === 'profile' && (
          <ProfilePage user={user} onUpdateUser={handleUpdateUser} />
        )}
      </div>
    </div>
  );
};

export default App;

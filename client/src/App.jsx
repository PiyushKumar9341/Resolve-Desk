import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewComplaintPage from './pages/NewComplaintPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { getProfileApi } from './services/api';

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loadingProfile, setLoadingProfile] = useState(false);

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

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setActiveTab('dashboard');
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

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        <Navbar user={user} />

        {activeTab === 'dashboard' && (
          <DashboardPage user={user} onNavigate={setActiveTab} />
        )}

        {activeTab === 'new-complaint' && (
          <NewComplaintPage onNavigate={setActiveTab} />
        )}

        {activeTab === 'my-complaints' && (
          <MyComplaintsPage onNavigate={setActiveTab} />
        )}

        {activeTab === 'profile' && (
          <ProfilePage user={user} onUpdateUser={handleUpdateUser} />
        )}
      </div>
    </div>
  );
};

export default App;

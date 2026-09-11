import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  User, 
  LogOut, 
  GraduationCap,
  ShieldCheck,
  Users,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon" style={isAdmin ? { background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)' } : {}}>
          {isAdmin ? <ShieldCheck size={24} /> : <GraduationCap size={24} />}
        </div>
        <div>
          <div className="brand-title">{isAdmin ? 'Admin Console' : 'Student Portal'}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
            {isAdmin ? 'Authority Portal' : 'Grievance Portal'}
          </div>
        </div>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

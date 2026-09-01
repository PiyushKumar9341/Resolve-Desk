import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  User, 
  LogOut, 
  GraduationCap 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-complaint', label: 'New Complaint', icon: PlusCircle },
    { id: 'my-complaints', label: 'My Complaints', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <GraduationCap size={24} />
        </div>
        <div>
          <div className="brand-title">Student Portal</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Grievance Portal</div>
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

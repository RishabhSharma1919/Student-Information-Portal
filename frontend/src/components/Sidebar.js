import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ items, activeSection, setActiveSection }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>🎓 EduPortal</h2>
        <p>{user?.role === 'admin' ? 'Admin Panel' : user?.role === 'faculty' ? 'Faculty Panel' : 'Student Panel'}</p>
      </div>

      <nav className="sidebar-nav">
        {items.map((item, i) => {
          if (item.type === 'section') {
            return <div key={i} className="nav-section-label">{item.label}</div>;
          }
          return (
            <button
              key={i}
              className={`nav-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || user?.email}</div>
            <div className="user-role">{user?.role === 'faculty' ? user?.designation || 'Faculty' : user?.role}</div>
          </div>
        </div>
        <button className="nav-item" onClick={handleLogout} style={{color:'var(--red)'}}>
          <span className="icon">🚪</span> Sign Out
        </button>
      </div>
    </div>
  );
}

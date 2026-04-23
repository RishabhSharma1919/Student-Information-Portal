import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AdminOverview from './AdminOverview';
import AdminStudents from './AdminStudents';
import AdminFaculty from './AdminFaculty';
import AdminCourses from './AdminCourses';
import AdminEnrollments from './AdminEnrollments';
import AdminResults from './AdminResults';
import AdminUsers from './AdminUsers';
import About from '../../components/About';

const NAV_ITEMS = [
  { type: 'section', label: 'Overview' },
  { key: 'overview',     icon: '📊', label: 'Dashboard' },
  { type: 'section', label: 'Management' },
  { key: 'students',    icon: '👨‍🎓', label: 'Students' },
  { key: 'faculty',     icon: '👨‍🏫', label: 'Faculty' },
  { key: 'courses',     icon: '📚', label: 'Courses' },
  { key: 'enrollments', icon: '📋', label: 'Enrollments' },
  { key: 'results',     icon: '📝', label: 'Results' },
  { type: 'section', label: 'System' },
  { key: 'users',       icon: '👤', label: 'User Accounts' },
  { key: 'about',       icon: 'ℹ️', label: 'About Project' },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':     return <AdminOverview />;
      case 'students':     return <AdminStudents />;
      case 'faculty':      return <AdminFaculty />;
      case 'courses':      return <AdminCourses />;
      case 'enrollments':  return <AdminEnrollments />;
      case 'results':      return <AdminResults />;
      case 'users':        return <AdminUsers />;
      case 'about':        return <About />;
      default:             return <AdminOverview />;
    }
  };

  const currentItem = NAV_ITEMS.find(i => i.key === activeSection);

  return (
    <div className="app-layout">
      <Sidebar items={NAV_ITEMS} activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">{currentItem?.icon} {currentItem?.label}</div>
          </div>
          <div className="topbar-right">
            <span className="badge badge-red">Admin</span>
          </div>
        </div>
        <div className="page-body">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

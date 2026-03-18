import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TeacherProfile from './TeacherProfile';
import TeacherCourses from './TeacherCourses';

const NAV_ITEMS = [
  { type: 'section', label: 'My Panel' },
  { key: 'profile', icon: '👤', label: 'My Profile' },
  { key: 'courses', icon: '📚', label: 'My Courses & Results' },
];

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState('courses');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <TeacherProfile />;
      case 'courses': return <TeacherCourses />;
      default:        return <TeacherCourses />;
    }
  };

  const currentItem = NAV_ITEMS.find(i => i.key === activeSection);

  return (
    <div className="app-layout">
      <Sidebar items={NAV_ITEMS} activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">{currentItem?.icon} {currentItem?.label}</div>
          <div className="topbar-right">
            <span className="badge badge-blue">Faculty</span>
          </div>
        </div>
        <div className="page-body">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

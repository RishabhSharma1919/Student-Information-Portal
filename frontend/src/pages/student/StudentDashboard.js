import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StudentProfile from './StudentProfile';
import StudentCourses from './StudentCourses';
import StudentResults from './StudentResults';
import About from '../../components/About';

const NAV_ITEMS = [
  { type: 'section', label: 'My Portal' },
  { key: 'profile',  icon: '👤', label: 'My Profile' },
  { key: 'courses',  icon: '📚', label: 'My Courses' },
  { key: 'results',  icon: '📝', label: 'My Results' },
  { type: 'section', label: 'System' },
  { key: 'about',    icon: 'ℹ️', label: 'About Project' },
];

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <StudentProfile />;
      case 'courses': return <StudentCourses />;
      case 'results': return <StudentResults />;
      case 'about':   return <About />;
      default: return <StudentProfile />;
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
            <span className="badge badge-green">Student</span>
          </div>
        </div>
        <div className="page-body">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

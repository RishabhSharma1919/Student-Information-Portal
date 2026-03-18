import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{marginTop:'60px'}} />;

  return (
    <div>
      <div className="section-header" style={{marginBottom:'28px'}}>
        <div>
          <h2>Welcome back, Administrator</h2>
          <p>Here's a snapshot of the institution today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-number">{stats?.total_students ?? '—'}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-number">{stats?.total_faculty ?? '—'}</div>
          <div className="stat-label">Faculty Members</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">📚</div>
          <div className="stat-number">{stats?.total_courses ?? '—'}</div>
          <div className="stat-label">Active Courses</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">📋</div>
          <div className="stat-number">{stats?.total_enrollments ?? '—'}</div>
          <div className="stat-label">Enrollments</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">⏳</div>
          <div className="stat-number">{stats?.results_pending ?? '—'}</div>
          <div className="stat-label">Results Pending</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">📌 Quick Guide</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
          {[
            { icon:'👨‍🎓', title:'Students', desc:'Add, edit, or deactivate student accounts. Manage their department and year.' },
            { icon:'👨‍🏫', title:'Faculty', desc:'Manage faculty profiles, designations, and department assignments.' },
            { icon:'📚', title:'Courses', desc:'Create courses and assign faculty. Set credits and semester.' },
            { icon:'📋', title:'Enrollments', desc:'Enroll students in courses. View all active enrollments.' },
            { icon:'📝', title:'Results', desc:'View and edit all student results across all courses.' },
            { icon:'👤', title:'User Accounts', desc:'Manage login credentials and reset passwords for any user.' },
          ].map((item, i) => (
            <div key={i} style={{display:'flex',gap:'12px',padding:'16px',background:'var(--surface2)',borderRadius:'10px',border:'1px solid var(--border)'}}>
              <div style={{fontSize:'24px'}}>{item.icon}</div>
              <div>
                <div style={{fontWeight:600,fontSize:'13px',marginBottom:'4px'}}>{item.title}</div>
                <div style={{fontSize:'12px',color:'var(--text3)',lineHeight:'1.5'}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

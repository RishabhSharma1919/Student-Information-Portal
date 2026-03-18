import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import TeacherResultsEditor from './TeacherResultsEditor';

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    API.get('/faculty/courses')
      .then(r => setCourses(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (selectedCourse) {
    return (
      <TeacherResultsEditor
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  if (loading) return <div className="spinner" style={{ marginTop: '60px' }} />;

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '28px' }}>
        <div>
          <h2>My Courses</h2>
          <p>Select a course to view students and update results</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>No courses assigned to you yet. Contact admin.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {courses.map(c => (
            <div
              key={c.course_id}
              className="card"
              style={{ cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s' }}
              onClick={() => setSelectedCourse(c)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', padding: '3px 10px', borderRadius: '6px' }}>
                  {c.course_code}
                </code>
                <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Sem {c.semester}</span>
              </div>

              <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '8px', color: 'var(--text)' }}>
                {c.course_name}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text3)' }}>🏛️ {c.dept_name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text3)' }}>📊 {c.credits} Credits</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(59,130,246,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px',
                  }}>👨‍🎓</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', fontFamily: 'monospace' }}>{c.enrolled_count}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Students</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm">
                  Open →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

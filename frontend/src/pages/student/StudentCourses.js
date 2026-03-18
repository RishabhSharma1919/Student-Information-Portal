import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/student/enrollments')
      .then(r => setEnrollments(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{marginTop:'60px'}} />;

  // Group by academic year + semester
  const grouped = enrollments.reduce((acc, e) => {
    const key = `${e.academic_year} — Semester ${e.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div>
      <div className="section-header" style={{marginBottom:'28px'}}>
        <div>
          <h2>My Courses</h2>
          <p>You are enrolled in {enrollments.length} course(s)</p>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>You are not enrolled in any courses yet.</p>
        </div>
      ) : Object.entries(grouped).map(([semester, courses]) => (
        <div key={semester} style={{marginBottom:'32px'}}>
          <div style={{fontSize:'13px',fontWeight:'600',color:'var(--text3)',marginBottom:'12px',textTransform:'uppercase',letterSpacing:'0.05em'}}>
            📅 {semester}
          </div>
          <div style={{display:'grid',gap:'12px'}}>
            {courses.map(e => (
              <div key={e.enrollment_id} className="card" style={{padding:'20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'16px'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                      <code style={{fontFamily:'monospace',fontSize:'12px',background:'rgba(59,130,246,0.1)',color:'var(--accent)',padding:'2px 8px',borderRadius:'4px'}}>
                        {e.course_code}
                      </code>
                      <span className={`badge ${e.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{e.status}</span>
                    </div>
                    <div style={{fontWeight:'600',fontSize:'15px',marginBottom:'6px'}}>{e.course_name}</div>
                    <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                      <span style={{fontSize:'12px',color:'var(--text3)'}}>🏛️ {e.dept_name}</span>
                      <span style={{fontSize:'12px',color:'var(--text3)'}}>📊 {e.credits} Credits</span>
                      {e.faculty_name && <span style={{fontSize:'12px',color:'var(--text3)'}}>👨‍🏫 {e.faculty_name}</span>}
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    {e.grade ? (
                      <div>
                        <div style={{fontSize:'24px',fontWeight:'700',fontFamily:'monospace',color: e.grade === 'A+' || e.grade === 'A' ? 'var(--green)' : e.grade === 'F' ? 'var(--red)' : 'var(--accent)'}}>
                          {e.grade}
                        </div>
                        <div style={{fontSize:'11px',color:'var(--text3)'}}>Grade</div>
                      </div>
                    ) : (
                      <span className="badge badge-yellow">Result Pending</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

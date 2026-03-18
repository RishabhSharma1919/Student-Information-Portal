import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

const gradeColor = (grade) => {
  if (grade === 'A+' || grade === 'A') return 'var(--green)';
  if (grade === 'B+' || grade === 'B') return 'var(--accent)';
  if (grade === 'C+' || grade === 'C') return 'var(--yellow)';
  if (grade === 'F') return 'var(--red)';
  return 'var(--text2)';
};

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/student/results'),
      API.get('/student/results/summary'),
    ]).then(([r, s]) => {
      setResults(r.data);
      setSummary(s.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{marginTop:'60px'}} />;

  return (
    <div>
      <div className="section-header" style={{marginBottom:'24px'}}>
        <div>
          <h2>My Results</h2>
          <p>Marks and grades for all completed courses</p>
        </div>
      </div>

      {/* CGPA Banner */}
      {summary && (
        <div className="cgpa-banner">
          <div>
            <div className="cgpa-number">{summary.cgpa}</div>
            <div className="cgpa-label">Cumulative GPA</div>
          </div>
          <div style={{width:'1px',height:'60px',background:'var(--border)'}} />
          <div>
            <div style={{fontSize:'22px',fontWeight:'700',fontFamily:'monospace',color:'var(--text)'}}>{summary.total_courses}</div>
            <div style={{fontSize:'12px',color:'var(--text3)'}}>Courses Completed</div>
          </div>
          <div>
            <div style={{fontSize:'22px',fontWeight:'700',fontFamily:'monospace',color:'var(--text)'}}>{summary.total_credits}</div>
            <div style={{fontSize:'12px',color:'var(--text3)'}}>Total Credits</div>
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>No results published yet. Check back after exams.</p>
        </div>
      ) : (
        <div className="results-grid">
          {results.map(r => (
            <div key={r.result_id} className="result-card">
              <div style={{flex:1}}>
                <div className="result-course">{r.course_name}</div>
                <div className="result-code">{r.course_code} · Sem {r.semester} · {r.academic_year}</div>
                {r.remarks && <div style={{fontSize:'12px',color:'var(--text3)',marginTop:'6px',fontStyle:'italic'}}>"{r.remarks}"</div>}
                <div style={{fontSize:'11px',color:'var(--text3)',marginTop:'6px'}}>
                  Updated by {r.updated_by_name || 'Admin'} · {new Date(r.updated_at).toLocaleDateString('en-IN')}
                </div>
              </div>
              <div className="result-marks" style={{textAlign:'right',flexShrink:0,paddingLeft:'16px'}}>
                <div className="result-total" style={{color: gradeColor(r.grade)}}>
                  {r.marks_total}
                  <span style={{fontSize:'14px',color:'var(--text3)',fontFamily:'sans-serif',fontWeight:400}}>/110</span>
                </div>
                <div className="result-breakdown">
                  Internal: {r.marks_internal} · External: {r.marks_external}
                </div>
                <div style={{marginTop:'6px'}}>
                  <span style={{
                    fontSize:'18px',fontWeight:'800',fontFamily:'monospace',
                    color: gradeColor(r.grade),
                    background: `${gradeColor(r.grade)}18`,
                    padding:'2px 10px',borderRadius:'6px'
                  }}>
                    {r.grade}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

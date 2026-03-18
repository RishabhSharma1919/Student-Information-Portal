import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

const GRADES = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

const gradeClass = (grade) => {
  const map = { 'A+': 'grade-aplus', 'A': 'grade-a', 'B+': 'grade-bplus', 'B': 'grade-b', 'C+': 'grade-cplus', 'F': 'grade-f' };
  return `grade ${map[grade] || ''}`;
};

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editResult, setEditResult] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const r = await API.get('/admin/results');
    setResults(r.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openEdit = (r) => {
    setEditResult(r);
    setForm({ marks_internal: r.marks_internal ?? '', marks_external: r.marks_external ?? '', grade: r.grade || '', remarks: r.remarks || '' });
    setError(''); setMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await API.put(`/admin/results/${editResult.result_id}`, form);
      setMsg('Result updated!');
      fetchData();
      setTimeout(() => { setShowModal(false); setMsg(''); }, 1000);
    } catch (e) {
      setError(e.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = results.filter(r =>
    r.student_name.toLowerCase().includes(search.toLowerCase()) ||
    r.course_name.toLowerCase().includes(search.toLowerCase()) ||
    r.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>All Results</h2>
          <p>{results.length} result records</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Search by student, roll number, course..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No.</th>
              <th>Course</th>
              <th>Internal (50)</th>
              <th>External (60)</th>
              <th>Total (110)</th>
              <th>Grade</th>
              <th>Updated By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={9}><div className="spinner" /></td></tr>
            ) : filtered.map(r => (
              <tr key={r.result_id}>
                <td><strong>{r.student_name}</strong></td>
                <td><code style={{fontFamily:'monospace',fontSize:'11px'}}>{r.roll_number}</code></td>
                <td>
                  <div style={{fontSize:'13px'}}>{r.course_name}</div>
                  <div style={{fontSize:'11px',color:'var(--accent)'}}>{r.course_code}</div>
                </td>
                <td style={{fontFamily:'monospace',textAlign:'center'}}>{r.marks_internal ?? <span style={{color:'var(--text3)'}}>—</span>}</td>
                <td style={{fontFamily:'monospace',textAlign:'center'}}>{r.marks_external ?? <span style={{color:'var(--text3)'}}>—</span>}</td>
                <td style={{fontFamily:'monospace',textAlign:'center',fontWeight:700}}>{r.marks_total ?? <span style={{color:'var(--text3)'}}>—</span>}</td>
                <td>{r.grade ? <span className={gradeClass(r.grade)}>{r.grade}</span> : <span style={{color:'var(--text3)'}}>Pending</span>}</td>
                <td style={{fontSize:'12px',color:'var(--text3)'}}>{r.updated_by_name || '—'}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>✏️ Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && editResult && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{maxWidth:'480px'}}>
            <div className="modal-header">
              <h3>✏️ Edit Result</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                {msg && <div className="alert alert-success">{msg}</div>}

                <div style={{background:'var(--surface2)',borderRadius:'8px',padding:'12px',marginBottom:'16px'}}>
                  <div style={{fontWeight:600,marginBottom:'4px'}}>{editResult.student_name}</div>
                  <div style={{fontSize:'12px',color:'var(--text3)'}}>{editResult.course_code} — {editResult.course_name}</div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Internal Marks (max 50) *</label>
                    <input type="number" min="0" max="50" step="0.5" className="form-input" required value={form.marks_internal} onChange={e => setForm({...form, marks_internal: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">External Marks (max 60) *</label>
                    <input type="number" min="0" max="60" step="0.5" className="form-input" required value={form.marks_external} onChange={e => setForm({...form, marks_external: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Grade *</label>
                  <select className="form-select" required value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>
                    <option value="">Select grade</option>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Remarks</label>
                  <input className="form-input" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} placeholder="Optional remarks" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update Result'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

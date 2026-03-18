import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ academic_year: '2024-25' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [e, s, c] = await Promise.all([
      API.get('/admin/enrollments'),
      API.get('/admin/students'),
      API.get('/admin/courses'),
    ]);
    setEnrollments(e.data);
    setStudents(s.data);
    setCourses(c.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await API.post('/admin/enrollments', form);
      setMsg('Student enrolled successfully!');
      fetchData();
      setTimeout(() => { setShowModal(false); setMsg(''); setForm({ academic_year: '2024-25' }); }, 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Error enrolling student');
    } finally {
      setSaving(false);
    }
  };

  const filtered = enrollments.filter(e =>
    e.student_name.toLowerCase().includes(search.toLowerCase()) ||
    e.course_name.toLowerCase().includes(search.toLowerCase()) ||
    e.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  const getGradeClass = (grade) => {
    if (!grade) return '';
    if (grade === 'A+') return 'grade grade-aplus';
    if (grade === 'A') return 'grade grade-a';
    if (grade === 'B+') return 'grade grade-bplus';
    if (grade === 'B') return 'grade grade-b';
    return 'grade';
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Enrollments</h2>
          <p>{enrollments.length} total enrollment records</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setError(''); setMsg(''); }}>+ Enroll Student</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Search by student name, roll number, course..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No.</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Year</th>
              <th>Status</th>
              <th>Internal</th>
              <th>External</th>
              <th>Total</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={10}><div className="spinner" /></td></tr>
            ) : filtered.map(e => (
              <tr key={e.enrollment_id}>
                <td><strong>{e.student_name}</strong></td>
                <td><code style={{fontFamily:'monospace',fontSize:'11px'}}>{e.roll_number}</code></td>
                <td>
                  <div>{e.course_name}</div>
                  <div style={{fontSize:'11px',color:'var(--text3)'}}>{e.course_code}</div>
                </td>
                <td style={{textAlign:'center'}}>{e.semester}</td>
                <td>{e.academic_year}</td>
                <td><span className={`badge ${e.status === 'Active' ? 'badge-green' : e.status === 'Completed' ? 'badge-blue' : 'badge-red'}`}>{e.status}</span></td>
                <td style={{fontFamily:'monospace',textAlign:'center'}}>{e.marks_internal ?? '—'}</td>
                <td style={{fontFamily:'monospace',textAlign:'center'}}>{e.marks_external ?? '—'}</td>
                <td style={{fontFamily:'monospace',textAlign:'center',fontWeight:600}}>{e.marks_total ?? '—'}</td>
                <td><span className={getGradeClass(e.grade)}>{e.grade ?? '—'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{maxWidth:'440px'}}>
            <div className="modal-header">
              <h3>+ Enroll Student in Course</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                {msg && <div className="alert alert-success">{msg}</div>}
                <div className="form-group">
                  <label className="form-label">Student *</label>
                  <select className="form-select" required value={form.student_id || ''} onChange={e => setForm({...form, student_id: e.target.value})}>
                    <option value="">Select student</option>
                    {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name} ({s.roll_number})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Course *</label>
                  <select className="form-select" required value={form.course_id || ''} onChange={e => {
                    const course = courses.find(c => c.course_id === parseInt(e.target.value));
                    setForm({...form, course_id: e.target.value, semester: course?.semester || ''});
                  }}>
                    <option value="">Select course</option>
                    {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_code} — {c.course_name}</option>)}
                  </select>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Semester *</label>
                    <input type="number" min="1" max="8" className="form-input" required value={form.semester || ''} onChange={e => setForm({...form, semester: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Academic Year *</label>
                    <input className="form-input" required value={form.academic_year || ''} onChange={e => setForm({...form, academic_year: e.target.value})} placeholder="e.g. 2024-25" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enrolling...' : 'Enroll Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

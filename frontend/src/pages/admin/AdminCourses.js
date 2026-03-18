import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [c, d, f] = await Promise.all([
      API.get('/admin/courses'),
      API.get('/admin/departments'),
      API.get('/admin/faculty'),
    ]);
    setCourses(c.data);
    setDepartments(d.data);
    setFaculty(f.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditCourse(null);
    setForm({ credits: 3, semester: 1, max_students: 60 });
    setError(''); setMsg('');
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditCourse(c);
    setForm({
      ...c,
      dept_id: departments.find(d => d.dept_name === c.dept_name)?.dept_id,
      faculty_id: faculty.find(f => f.name === c.faculty_name)?.faculty_id || '',
    });
    setError(''); setMsg('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? All enrollments will be lost.')) return;
    try {
      await API.delete(`/admin/courses/${id}`);
      fetchData();
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editCourse) {
        await API.put(`/admin/courses/${editCourse.course_id}`, form);
      } else {
        await API.post('/admin/courses', form);
      }
      setMsg('Course saved!');
      fetchData();
      setTimeout(() => { setShowModal(false); setMsg(''); }, 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Error saving course');
    } finally {
      setSaving(false);
    }
  };

  const filtered = courses.filter(c =>
    c.course_name.toLowerCase().includes(search.toLowerCase()) ||
    c.course_code.toLowerCase().includes(search.toLowerCase()) ||
    (c.faculty_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Courses</h2>
          <p>{courses.length} courses available</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Course</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Search by name, code, faculty..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Semester</th>
              <th>Faculty</th>
              <th>Enrolled / Max</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={8}><div className="spinner" /></td></tr>
            ) : filtered.map(c => (
              <tr key={c.course_id}>
                <td><code style={{fontFamily:'monospace',fontSize:'12px',color:'var(--accent)'}}>{c.course_code}</code></td>
                <td><strong>{c.course_name}</strong></td>
                <td>{c.dept_name}</td>
                <td style={{textAlign:'center'}}>{c.credits}</td>
                <td style={{textAlign:'center'}}>{c.semester}</td>
                <td>{c.faculty_name || <span style={{color:'var(--text3)'}}>Unassigned</span>}</td>
                <td>
                  <span style={{fontFamily:'monospace'}}>{c.enrolled_count}</span>
                  <span style={{color:'var(--text3)'}}> / {c.max_students}</span>
                </td>
                <td>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.course_id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editCourse ? '✏️ Edit Course' : '+ Add New Course'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                {msg && <div className="alert alert-success">{msg}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Course Code *</label>
                    <input className="form-input" required value={form.course_code || ''} onChange={e => setForm({...form, course_code: e.target.value})} placeholder="e.g. CS301" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credits *</label>
                    <input type="number" min="1" max="6" className="form-input" required value={form.credits || 3} onChange={e => setForm({...form, credits: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Course Name *</label>
                  <input className="form-input" required value={form.course_name || ''} onChange={e => setForm({...form, course_name: e.target.value})} placeholder="Full course name" />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select className="form-select" required value={form.dept_id || ''} onChange={e => setForm({...form, dept_id: e.target.value})}>
                      <option value="">Select</option>
                      {departments.map(d => <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assigned Faculty</label>
                    <select className="form-select" value={form.faculty_id || ''} onChange={e => setForm({...form, faculty_id: e.target.value})}>
                      <option value="">None / Unassigned</option>
                      {faculty.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Semester *</label>
                    <select className="form-select" required value={form.semester || 1} onChange={e => setForm({...form, semester: e.target.value})}>
                      {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Students</label>
                    <input type="number" className="form-input" value={form.max_students || 60} onChange={e => setForm({...form, max_students: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editCourse ? 'Update Course' : 'Create Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

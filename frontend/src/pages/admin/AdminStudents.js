import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [s, d] = await Promise.all([
      API.get('/admin/students'),
      API.get('/admin/departments'),
    ]);
    setStudents(s.data);
    setDepartments(d.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditStudent(null);
    setForm({ gender: 'Male', year_of_study: 1 });
    setError(''); setMsg('');
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ ...s, dept_id: departments.find(d => d.dept_name === s.dept_name)?.dept_id });
    setError(''); setMsg('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try {
      await API.delete(`/admin/students/${id}`);
      fetchData();
    } catch (e) {
      alert(e.response?.data?.message || 'Error deleting student');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editStudent) {
        await API.put(`/admin/students/${editStudent.student_id}`, form);
      } else {
        await API.post('/admin/students', form);
      }
      setMsg(editStudent ? 'Student updated!' : 'Student created!');
      fetchData();
      setTimeout(() => { setShowModal(false); setMsg(''); }, 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Error saving student');
    } finally {
      setSaving(false);
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Students</h2>
          <p>{students.length} total students registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Student</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Search by name, roll number, email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={8}><div className="spinner" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{textAlign:'center',color:'var(--text3)',padding:'40px'}}>No students found</td></tr>
            ) : filtered.map(s => (
              <tr key={s.student_id}>
                <td><code style={{fontFamily:'monospace',fontSize:'12px'}}>{s.roll_number}</code></td>
                <td><strong>{s.name}</strong></td>
                <td style={{color:'var(--text3)',fontSize:'12px'}}>{s.email}</td>
                <td>{s.dept_name}</td>
                <td>Year {s.year_of_study}</td>
                <td>{s.gender}</td>
                <td>
                  <span className={`badge ${s.is_active ? 'badge-green' : 'badge-red'}`}>
                    {s.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.student_id)}>🗑️</button>
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
              <h3>{editStudent ? '✏️ Edit Student' : '+ Add New Student'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                {msg && <div className="alert alert-success">{msg}</div>}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" required value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Roll Number *</label>
                    <input className="form-input" required value={form.roll_number || ''} onChange={e => setForm({...form, roll_number: e.target.value})} placeholder="e.g. CS2024001" />
                  </div>
                </div>

                {!editStudent && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" required value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password (default: Password@123)</label>
                      <input type="password" className="form-input" value={form.password || ''} onChange={e => setForm({...form, password: e.target.value})} placeholder="Leave blank for default" />
                    </div>
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select className="form-select" required value={form.dept_id || ''} onChange={e => setForm({...form, dept_id: e.target.value})}>
                      <option value="">Select department</option>
                      {departments.map(d => <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year of Study *</label>
                    <select className="form-select" required value={form.year_of_study || 1} onChange={e => setForm({...form, year_of_study: e.target.value})}>
                      {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={form.gender || 'Male'} onChange={e => setForm({...form, gender: e.target.value})}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-input" value={form.date_of_birth?.split('T')[0] || ''} onChange={e => setForm({...form, date_of_birth: e.target.value})} />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.contact_phone || ''} onChange={e => setForm({...form, contact_phone: e.target.value})} placeholder="10-digit number" />
                  </div>
                  {editStudent && (
                    <div className="form-group">
                      <label className="form-label">Account Status</label>
                      <select className="form-select" value={form.is_active ? '1' : '0'} onChange={e => setForm({...form, is_active: e.target.value === '1'})}>
                        <option value="1">Active</option>
                        <option value="0">Inactive (blocked)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editStudent ? 'Update Student' : 'Create Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

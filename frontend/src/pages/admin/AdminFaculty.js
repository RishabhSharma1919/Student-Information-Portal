import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

const DESIGNATIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editFaculty, setEditFaculty] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [f, d] = await Promise.all([API.get('/admin/faculty'), API.get('/admin/departments')]);
    setFaculty(f.data);
    setDepartments(d.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditFaculty(null);
    setForm({ designation: 'Assistant Professor' });
    setError(''); setMsg('');
    setShowModal(true);
  };

  const openEdit = (f) => {
    setEditFaculty(f);
    setForm({ ...f, dept_id: departments.find(d => d.dept_name === f.dept_name)?.dept_id });
    setError(''); setMsg('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    try {
      await API.delete(`/admin/faculty/${id}`);
      fetchData();
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editFaculty) {
        await API.put(`/admin/faculty/${editFaculty.faculty_id}`, form);
      } else {
        await API.post('/admin/faculty', form);
      }
      setMsg(editFaculty ? 'Faculty updated!' : 'Faculty created!');
      fetchData();
      setTimeout(() => { setShowModal(false); setMsg(''); }, 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Error saving faculty');
    } finally {
      setSaving(false);
    }
  };

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase()) ||
    f.dept_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Faculty Members</h2>
          <p>{faculty.length} total faculty registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Faculty</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Search by name, email, department..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={7}><div className="spinner" /></td></tr>
            ) : filtered.map(f => (
              <tr key={f.faculty_id}>
                <td><strong>{f.name}</strong></td>
                <td style={{color:'var(--text3)',fontSize:'12px'}}>{f.email}</td>
                <td>{f.dept_name}</td>
                <td>
                  <span className="badge badge-blue" style={{fontSize:'11px'}}>{f.designation}</span>
                </td>
                <td style={{fontFamily:'monospace'}}>{f.phone || '—'}</td>
                <td>
                  <span className={`badge ${f.is_active ? 'badge-green' : 'badge-red'}`}>
                    {f.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(f)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.faculty_id)}>🗑️</button>
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
              <h3>{editFaculty ? '✏️ Edit Faculty' : '+ Add Faculty Member'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                {msg && <div className="alert alert-success">{msg}</div>}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" required value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} placeholder="Dr. / Prof. Full Name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>

                {!editFaculty && (
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
                    <label className="form-label">Designation *</label>
                    <select className="form-select" required value={form.designation || ''} onChange={e => setForm({...form, designation: e.target.value})}>
                      {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {editFaculty && (
                  <div className="form-group">
                    <label className="form-label">Account Status</label>
                    <select className="form-select" value={form.is_active ? '1' : '0'} onChange={e => setForm({...form, is_active: e.target.value === '1'})}>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editFaculty ? 'Update' : 'Create Faculty'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

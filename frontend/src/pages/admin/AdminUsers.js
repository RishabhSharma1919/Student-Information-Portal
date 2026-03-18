import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const r = await API.get('/admin/users');
    setUsers(r.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openReset = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setError(''); setMsg('');
    setShowModal(true);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      await API.put(`/admin/users/${selectedUser.user_id}/reset-password`, { new_password: newPassword });
      setMsg(`Password reset for ${selectedUser.email}`);
      setTimeout(() => { setShowModal(false); setMsg(''); }, 1500);
    } catch (e) {
      setError(e.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = { admin: 'badge-red', student: 'badge-green', faculty: 'badge-blue' };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>User Accounts</h2>
          <p>{users.length} total user accounts</p>
        </div>
      </div>

      <div className="alert alert-info" style={{marginBottom:'20px'}}>
        💡 User accounts are created automatically when you add students or faculty. Use this page to reset passwords or check account status.
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Search by email or role..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={5}><div className="spinner" /></td></tr>
            ) : filtered.map(u => (
              <tr key={u.user_id}>
                <td><strong style={{fontFamily:'monospace',fontSize:'12px'}}>{u.email}</strong></td>
                <td><span className={`badge ${roleColor[u.role] || 'badge-gray'}`}>{u.role}</span></td>
                <td><span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                <td style={{fontSize:'12px',color:'var(--text3)'}}>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => openReset(u)}>🔑 Reset Password</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{maxWidth:'400px'}}>
            <div className="modal-header">
              <h3>🔑 Reset Password</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleReset}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                {msg && <div className="alert alert-success">{msg}</div>}
                <p style={{fontSize:'13px',color:'var(--text2)',marginBottom:'16px'}}>
                  Resetting password for: <strong style={{color:'var(--accent)'}}>{selectedUser?.email}</strong>
                </p>
                <div className="form-group">
                  <label className="form-label">New Password *</label>
                  <input type="password" className="form-input" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" autoFocus />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Resetting...' : 'Reset Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

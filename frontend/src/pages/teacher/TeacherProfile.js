import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({});
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    API.get('/faculty/profile')
      .then(r => setProfile(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(''); setPwMsg('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    try {
      await API.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg('Password changed successfully!');
      setPwForm({});
      setTimeout(() => { setShowPwModal(false); setPwMsg(''); }, 1500);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Error changing password');
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '60px' }} />;
  if (!profile) return <div className="empty-state"><div className="empty-icon">❌</div><p>Profile not found.</p></div>;

  const fields = [
    { label: 'Full Name', value: profile.name },
    { label: 'Email', value: user?.email },
    { label: 'Department', value: profile.dept_name },
    { label: 'Designation', value: profile.designation },
    { label: 'Phone', value: profile.phone || '—' },
  ];

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '28px' }}>
        <div>
          <h2>My Profile</h2>
          <p>Your faculty information</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setShowPwModal(true)}>🔑 Change Password</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: '700', color: 'white',
            margin: '0 auto 16px',
          }}>
            {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div style={{ fontWeight: '700', fontSize: '17px', marginBottom: '4px' }}>{profile.name}</div>
          <div style={{ color: 'var(--text3)', fontSize: '12px', marginBottom: '12px' }}>{profile.designation}</div>
          <span className="badge badge-blue">{profile.dept_name}</span>
        </div>

        <div className="card">
          <div className="card-title">📋 Faculty Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {fields.map((f, i) => (
              <div key={i} style={{ padding: '12px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPwModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPwModal(false)}>
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>🔑 Change Password</h3>
              <button className="modal-close" onClick={() => setShowPwModal(false)}>×</button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="modal-body">
                {pwError && <div className="alert alert-error">{pwError}</div>}
                {pwMsg && <div className="alert alert-success">{pwMsg}</div>}
                <div className="form-group">
                  <label className="form-label">Current Password *</label>
                  <input type="password" className="form-input" required value={pwForm.currentPassword || ''} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password *</label>
                  <input type="password" className="form-input" required minLength={6} value={pwForm.newPassword || ''} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password *</label>
                  <input type="password" className="form-input" required value={pwForm.confirmPassword || ''} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPwModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

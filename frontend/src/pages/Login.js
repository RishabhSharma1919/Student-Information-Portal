import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_CREDS = [
  { role: 'admin',   email: 'admin@portal.edu',           label: 'Administrator' },
  { role: 'faculty', email: 'priya.sharma@portal.edu',    label: 'Dr. Priya Sharma' },
  { role: 'faculty', email: 'rajesh.kumar@portal.edu',    label: 'Prof. Rajesh Kumar' },
  { role: 'student', email: 'amit.patel@student.edu',     label: 'Amit Patel (CS Y3)' },
  { role: 'student', email: 'neha.singh@student.edu',     label: 'Neha Singh (CS Y2)' },
  { role: 'student', email: 'pooja.gupta@student.edu',    label: 'Pooja Gupta (Math)' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'student') navigate('/student');
      else if (user.role === 'faculty') navigate('/teacher');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCreds = (cred) => {
    setEmail(cred.email);
    setPassword('Password@123');
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow" />
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🎓</div>
          <h1>Student Portal</h1>
          <p>Information Management System</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '🔄 Signing in...' : '→ Sign In'}
          </button>
        </form>

        <div className="demo-creds">
          <h4>🧪 Demo Accounts — click to fill</h4>
          <p style={{fontSize:'11px',color:'var(--text3)',marginBottom:'8px'}}>All passwords: <code style={{fontFamily:'monospace',color:'var(--text2)'}}>password</code></p>
          {DEMO_CREDS.map((cred, i) => (
            <div key={i} className="demo-cred-item" onClick={() => fillCreds(cred)} title="Click to fill">
              <span className={`cred-role ${cred.role}`}>
                {cred.role === 'admin' ? '🔴' : cred.role === 'faculty' ? '🔵' : '🟢'} {cred.label}
              </span>
              <span className="cred-email">{cred.email}</span>
            </div>
          ))}
        </div>
        <div style={{
          textAlign: 'center', 
          fontSize: '11px', 
          color: 'var(--text3)', 
          marginTop: '20px', 
          borderTop: '1px solid var(--border)', 
          paddingTop: '15px',
          opacity: 0.8
        }}>
          Project Developed by <b>Rishabh Sharma</b>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function About() {
  return (
    <div className="about-section" style={{ padding: '20px', maxWidth: '800px' }}>
      <div className="card">
        <h1 style={{ marginBottom: '15px' }}>🎓 About Student Information Portal</h1>
        <p style={{ color: 'var(--text2)', marginBottom: '20px', lineHeight: '1.6' }}>
          This Student Information Portal is a comprehensive full-stack application designed to streamline academic management. 
          It provides specialized interfaces for Administrators, Faculty, and Students to manage enrollments, track academic progress, 
          and facilitate communication.
        </p>

        <h3 style={{ marginBottom: '10px' }}>🛠️ Technology Stack</h3>
        <ul style={{ marginBottom: '20px', paddingLeft: '20px', color: 'var(--text2)' }}>
          <li><strong>Frontend:</strong> React.js 18, React Router v6, Axios</li>
          <li><strong>Backend:</strong> Node.js, Express.js</li>
          <li><strong>Database:</strong> Postgres(Neon) </li>
          <li><strong>Authentication:</strong> JWT (JSON Web Tokens) & Bcrypt</li>
          <li><strong>Styling:</strong> Vanilla CSS with Modern Variables</li>
        </ul>

        <p style={{ marginTop: '30px', fontSize: '12px', color: 'var(--text3)', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} Student Information Portal. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

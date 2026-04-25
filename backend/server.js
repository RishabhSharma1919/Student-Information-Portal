/**

 * @description Student Information Portal Backend Entry Point
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

//  MIDDLEWARE 
const allowedOrigins = [
  'http://localhost:3000',
  'https://student-information-portal-nu.vercel.app',
  (process.env.FRONTEND_URL || '').replace(/['"]/g, '').trim()
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  ROUTES 
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/admin',   require('./routes/admin'));
app.use('/api/student', require('./routes/student'));
app.use('/api/faculty', require('./routes/faculty'));

//  HEALTH CHECK 
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Student Portal API is running', 

    timestamp: new Date() 
  });
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// START SERVER 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Student Portal Backend running on http://localhost:${PORT}`);

  console.log(`📋 API Endpoints:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/admin/dashboard`);
  console.log(`   GET  /api/student/results`);
  console.log(`   GET  /api/faculty/courses\n`);
});

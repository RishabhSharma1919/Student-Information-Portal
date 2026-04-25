/**

 * @description Authentication Controller
 */
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//  LOGIN 
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Get user by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Get role-specific info
    let profileInfo = {};
    if (user.role === 'student') {
      const [rows] = await db.query(
        `SELECT s.student_id, s.name, s.roll_number, d.dept_name, s.year_of_study
         FROM students s JOIN departments d ON s.dept_id = d.dept_id
         WHERE s.user_id = ?`, [user.user_id]
      );
      if (rows[0]) profileInfo = rows[0];
    } else if (user.role === 'faculty') {
      const [rows] = await db.query(
        `SELECT f.faculty_id, f.name, f.designation, d.dept_name
         FROM faculty f JOIN departments d ON f.dept_id = d.dept_id
         WHERE f.user_id = ?`, [user.user_id]
      );
      if (rows[0]) profileInfo = rows[0];
    } else if (user.role === 'admin') {
      profileInfo = { name: 'Administrator' };
    }

    // Create JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        ...profileInfo
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        ...profileInfo
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.user_id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    const user = users[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hash, userId]);

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

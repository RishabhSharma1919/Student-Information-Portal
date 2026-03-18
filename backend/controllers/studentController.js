const db = require('../config/db');

// ── GET OWN PROFILE ────────────────────────────────────────
exports.getMyProfile = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, d.dept_name, u.email
      FROM students s
      JOIN departments d ON s.dept_id = d.dept_id
      JOIN users u ON s.user_id = u.user_id
      WHERE s.user_id = ?
    `, [req.user.user_id]);

    if (!rows[0]) return res.status(404).json({ message: 'Student profile not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// ── GET MY ENROLLMENTS ─────────────────────────────────────
exports.getMyEnrollments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.enrollment_id, e.semester, e.academic_year, e.status, e.enrollment_date,
             c.course_code, c.course_name, c.credits,
             d.dept_name,
             f.name as faculty_name, f.designation,
             r.marks_internal, r.marks_external, r.marks_total, r.grade, r.remarks
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN departments d ON c.dept_id = d.dept_id
      LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
      LEFT JOIN results r ON e.enrollment_id = r.enrollment_id
      WHERE e.student_id = (SELECT student_id FROM students WHERE user_id = ?)
      ORDER BY e.academic_year DESC, e.semester DESC
    `, [req.user.user_id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enrollments', error: err.message });
  }
};

// ── GET MY RESULTS ─────────────────────────────────────────
exports.getMyResults = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.result_id, r.marks_internal, r.marks_external, r.marks_total, r.grade, r.remarks, r.updated_at,
             c.course_code, c.course_name, c.credits,
             e.semester, e.academic_year,
             f.name as updated_by_name
      FROM results r
      JOIN enrollments e ON r.enrollment_id = e.enrollment_id
      JOIN courses c ON e.course_id = c.course_id
      LEFT JOIN faculty f ON r.updated_by = f.faculty_id
      WHERE e.student_id = (SELECT student_id FROM students WHERE user_id = ?)
      AND r.grade IS NOT NULL
      ORDER BY e.academic_year DESC, e.semester DESC
    `, [req.user.user_id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching results', error: err.message });
  }
};

// ── GET RESULT SUMMARY (CGPA etc.) ─────────────────────────
exports.getMyResultSummary = async (req, res) => {
  try {
    const gradePoints = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0 };

    const [rows] = await db.query(`
      SELECT r.grade, c.credits, e.semester, e.academic_year
      FROM results r
      JOIN enrollments e ON r.enrollment_id = e.enrollment_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = (SELECT student_id FROM students WHERE user_id = ?)
      AND r.grade IS NOT NULL
    `, [req.user.user_id]);

    let totalCredits = 0, totalPoints = 0;
    rows.forEach(r => {
      const gp = gradePoints[r.grade] || 0;
      totalCredits += r.credits;
      totalPoints += gp * r.credits;
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    res.json({ cgpa, total_courses: rows.length, total_credits: totalCredits });
  } catch (err) {
    res.status(500).json({ message: 'Error computing summary', error: err.message });
  }
};

const db = require('../config/db');

// ── GET OWN PROFILE ────────────────────────────────────────
exports.getMyProfile = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, d.dept_name, u.email
      FROM faculty f
      JOIN departments d ON f.dept_id = d.dept_id
      JOIN users u ON f.user_id = u.user_id
      WHERE f.user_id = ?
    `, [req.user.user_id]);

    if (!rows[0]) return res.status(404).json({ message: 'Faculty profile not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// ── GET MY COURSES ─────────────────────────────────────────
exports.getMyCourses = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.course_id, c.course_code, c.course_name, c.credits, c.semester, c.max_students,
             d.dept_name,
             (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.course_id AND e.status = 'Active') as enrolled_count
      FROM courses c
      JOIN departments d ON c.dept_id = d.dept_id
      WHERE c.faculty_id = (SELECT faculty_id FROM faculty WHERE user_id = ?)
      ORDER BY c.semester, c.course_code
    `, [req.user.user_id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// ── GET STUDENTS IN MY COURSE ──────────────────────────────
exports.getCourseStudents = async (req, res) => {
  const { courseId } = req.params;
  try {
    // Verify this course belongs to this faculty
    const [courseCheck] = await db.query(
      'SELECT * FROM courses WHERE course_id = ? AND faculty_id = (SELECT faculty_id FROM faculty WHERE user_id = ?)',
      [courseId, req.user.user_id]
    );
    if (!courseCheck[0]) {
      return res.status(403).json({ message: 'You are not assigned to this course' });
    }

    const [rows] = await db.query(`
      SELECT e.enrollment_id, e.status, e.enrollment_date,
             s.student_id, s.name as student_name, s.roll_number,
             r.result_id, r.marks_internal, r.marks_external, r.marks_total, r.grade, r.remarks
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      LEFT JOIN results r ON e.enrollment_id = r.enrollment_id
      WHERE e.course_id = ? AND e.status = 'Active'
      ORDER BY s.roll_number
    `, [courseId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// ── UPDATE RESULT ──────────────────────────────────────────
exports.updateResult = async (req, res) => {
  const { resultId } = req.params;
  const { marks_internal, marks_external, grade, remarks } = req.body;

  // Validate marks
  if (marks_internal < 0 || marks_internal > 50 || marks_external < 0 || marks_external > 60) {
    return res.status(400).json({ message: 'Internal marks: 0-50, External marks: 0-60' });
  }

  try {
    // Verify this result belongs to a course assigned to this faculty
    const [check] = await db.query(`
      SELECT r.result_id FROM results r
      JOIN enrollments e ON r.enrollment_id = e.enrollment_id
      JOIN courses c ON e.course_id = c.course_id
      JOIN faculty f ON c.faculty_id = f.faculty_id
      WHERE r.result_id = ? AND f.user_id = ?
    `, [resultId, req.user.user_id]);

    if (!check[0]) {
      return res.status(403).json({ message: 'You are not authorized to update this result' });
    }

    const [faculty] = await db.query('SELECT faculty_id FROM faculty WHERE user_id = ?', [req.user.user_id]);

    await db.query(
      'UPDATE results SET marks_internal=?, marks_external=?, grade=?, remarks=?, updated_by=? WHERE result_id=?',
      [marks_internal, marks_external, grade, remarks, faculty[0].faculty_id, resultId]
    );

    res.json({ message: 'Result updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating result', error: err.message });
  }
};

// ── GET COURSE RESULT SUMMARY ──────────────────────────────
exports.getCourseResultSummary = async (req, res) => {
  const { courseId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT r.grade, COUNT(*) as count
      FROM results r
      JOIN enrollments e ON r.enrollment_id = e.enrollment_id
      WHERE e.course_id = ? AND r.grade IS NOT NULL
      GROUP BY r.grade
      ORDER BY r.grade
    `, [courseId]);

    const [stats] = await db.query(`
      SELECT AVG(r.marks_total) as avg_marks, MAX(r.marks_total) as max_marks, MIN(r.marks_total) as min_marks
      FROM results r
      JOIN enrollments e ON r.enrollment_id = e.enrollment_id
      WHERE e.course_id = ? AND r.marks_total IS NOT NULL
    `, [courseId]);

    res.json({ grade_distribution: rows, stats: stats[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

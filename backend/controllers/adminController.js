const db = require('../config/db');
const bcrypt = require('bcryptjs');

// ── DASHBOARD STATS ────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ total_students }]] = await db.query('SELECT COUNT(*) as total_students FROM students');
    const [[{ total_faculty }]] = await db.query('SELECT COUNT(*) as total_faculty FROM faculty');
    const [[{ total_courses }]] = await db.query('SELECT COUNT(*) as total_courses FROM courses');
    const [[{ total_enrollments }]] = await db.query("SELECT COUNT(*) as total_enrollments FROM enrollments WHERE status='Active'");
    const [[{ results_pending }]] = await db.query('SELECT COUNT(*) as results_pending FROM results WHERE grade IS NULL');

    res.json({ total_students, total_faculty, total_courses, total_enrollments, results_pending });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};

// ── STUDENTS ───────────────────────────────────────────────
exports.getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.student_id, s.name, s.roll_number, s.year_of_study, s.gender,
             s.date_of_birth, s.contact_phone, d.dept_name, u.email, u.is_active
      FROM students s
      JOIN departments d ON s.dept_id = d.dept_id
      JOIN users u ON s.user_id = u.user_id
      ORDER BY s.roll_number
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, d.dept_name, u.email, u.is_active
      FROM students s
      JOIN departments d ON s.dept_id = d.dept_id
      JOIN users u ON s.user_id = u.user_id
      WHERE s.student_id = ?
    `, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Student not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  const { name, email, password, date_of_birth, gender, dept_id, year_of_study, contact_phone, roll_number } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const hash = await bcrypt.hash(password || 'Password@123', 10);
    const [userResult] = await conn.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, "student")',
      [email.toLowerCase(), hash]
    );

    await conn.query(
      'INSERT INTO students (user_id, name, date_of_birth, gender, dept_id, year_of_study, contact_phone, roll_number) VALUES (?,?,?,?,?,?,?,?)',
      [userResult.insertId, name, date_of_birth, gender, dept_id, year_of_study, contact_phone, roll_number]
    );

    await conn.commit();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email or roll number already exists' });
    res.status(500).json({ message: 'Error creating student', error: err.message });
  } finally {
    conn.release();
  }
};

exports.updateStudent = async (req, res) => {
  const { name, date_of_birth, gender, dept_id, year_of_study, contact_phone, roll_number, is_active } = req.body;
  try {
    const [student] = await db.query('SELECT user_id FROM students WHERE student_id = ?', [req.params.id]);
    if (!student[0]) return res.status(404).json({ message: 'Student not found' });

    await db.query(
      'UPDATE students SET name=?, date_of_birth=?, gender=?, dept_id=?, year_of_study=?, contact_phone=?, roll_number=? WHERE student_id=?',
      [name, date_of_birth, gender, dept_id, year_of_study, contact_phone, roll_number, req.params.id]
    );

    if (is_active !== undefined) {
      await db.query('UPDATE users SET is_active=? WHERE user_id=?', [is_active, student[0].user_id]);
    }

    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating student', error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM students WHERE student_id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Student not found' });
    await db.query('DELETE FROM users WHERE user_id = ?', [rows[0].user_id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err.message });
  }
};

// ── FACULTY ────────────────────────────────────────────────
exports.getAllFaculty = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.faculty_id, f.name, f.designation, f.phone, d.dept_name, u.email, u.is_active
      FROM faculty f
      JOIN departments d ON f.dept_id = d.dept_id
      JOIN users u ON f.user_id = u.user_id
      ORDER BY f.name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching faculty', error: err.message });
  }
};

exports.createFaculty = async (req, res) => {
  const { name, email, password, dept_id, designation, phone } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const hash = await bcrypt.hash(password || 'Password@123', 10);
    const [userResult] = await conn.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, "faculty")',
      [email.toLowerCase(), hash]
    );
    await conn.query(
      'INSERT INTO faculty (user_id, name, dept_id, designation, phone) VALUES (?,?,?,?,?)',
      [userResult.insertId, name, dept_id, designation, phone]
    );
    await conn.commit();
    res.status(201).json({ message: 'Faculty created successfully' });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Error creating faculty', error: err.message });
  } finally {
    conn.release();
  }
};

exports.updateFaculty = async (req, res) => {
  const { name, dept_id, designation, phone, is_active } = req.body;
  try {
    const [faculty] = await db.query('SELECT user_id FROM faculty WHERE faculty_id = ?', [req.params.id]);
    if (!faculty[0]) return res.status(404).json({ message: 'Faculty not found' });
    await db.query(
      'UPDATE faculty SET name=?, dept_id=?, designation=?, phone=? WHERE faculty_id=?',
      [name, dept_id, designation, phone, req.params.id]
    );
    if (is_active !== undefined) {
      await db.query('UPDATE users SET is_active=? WHERE user_id=?', [is_active, faculty[0].user_id]);
    }
    res.json({ message: 'Faculty updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating faculty', error: err.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM faculty WHERE faculty_id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Faculty not found' });
    await db.query('DELETE FROM users WHERE user_id = ?', [rows[0].user_id]);
    res.json({ message: 'Faculty deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting faculty', error: err.message });
  }
};

// ── COURSES ────────────────────────────────────────────────
exports.getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, d.dept_name, f.name as faculty_name,
             (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.course_id AND e.status='Active') as enrolled_count
      FROM courses c
      JOIN departments d ON c.dept_id = d.dept_id
      LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
      ORDER BY c.course_code
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  const { course_code, course_name, credits, dept_id, faculty_id, semester, max_students } = req.body;
  try {
    await db.query(
      'INSERT INTO courses (course_code, course_name, credits, dept_id, faculty_id, semester, max_students) VALUES (?,?,?,?,?,?,?)',
      [course_code, course_name, credits, dept_id, faculty_id || null, semester, max_students || 60]
    );
    res.status(201).json({ message: 'Course created successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Course code already exists' });
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  const { course_code, course_name, credits, dept_id, faculty_id, semester, max_students } = req.body;
  try {
    await db.query(
      'UPDATE courses SET course_code=?, course_name=?, credits=?, dept_id=?, faculty_id=?, semester=?, max_students=? WHERE course_id=?',
      [course_code, course_name, credits, dept_id, faculty_id || null, semester, max_students, req.params.id]
    );
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await db.query('DELETE FROM courses WHERE course_id = ?', [req.params.id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// ── ENROLLMENTS ────────────────────────────────────────────
exports.getAllEnrollments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.enrollment_id, e.semester, e.academic_year, e.status, e.enrollment_date,
             s.name as student_name, s.roll_number,
             c.course_name, c.course_code,
             r.marks_internal, r.marks_external, r.marks_total, r.grade
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      JOIN courses c ON e.course_id = c.course_id
      LEFT JOIN results r ON e.enrollment_id = r.enrollment_id
      ORDER BY e.enrollment_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

exports.createEnrollment = async (req, res) => {
  const { student_id, course_id, semester, academic_year } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO enrollments (student_id, course_id, semester, academic_year) VALUES (?,?,?,?)',
      [student_id, course_id, semester, academic_year || '2024-25']
    );
    await conn.query(
      'INSERT INTO results (enrollment_id) VALUES (?)',
      [result.insertId]
    );
    await conn.commit();
    res.status(201).json({ message: 'Student enrolled successfully' });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Student already enrolled in this course' });
    res.status(500).json({ message: 'Error enrolling student', error: err.message });
  } finally {
    conn.release();
  }
};

// ── ALL RESULTS ────────────────────────────────────────────
exports.getAllResults = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.result_id, r.marks_internal, r.marks_external, r.marks_total, r.grade, r.remarks, r.updated_at,
             s.name as student_name, s.roll_number,
             c.course_name, c.course_code,
             f.name as updated_by_name
      FROM results r
      JOIN enrollments e ON r.enrollment_id = e.enrollment_id
      JOIN students s ON e.student_id = s.student_id
      JOIN courses c ON e.course_id = c.course_id
      LEFT JOIN faculty f ON r.updated_by = f.faculty_id
      ORDER BY r.updated_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

exports.updateResult = async (req, res) => {
  const { marks_internal, marks_external, grade, remarks } = req.body;
  try {
    await db.query(
      'UPDATE results SET marks_internal=?, marks_external=?, grade=?, remarks=?, updated_by=? WHERE result_id=?',
      [marks_internal, marks_external, grade, remarks, req.user.faculty_id || null, req.params.id]
    );
    res.json({ message: 'Result updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// ── DEPARTMENTS ────────────────────────────────────────────
exports.getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM departments ORDER BY dept_name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// ── USER MANAGEMENT ────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT user_id, email, role, is_active, created_at FROM users ORDER BY role, email'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

exports.resetUserPassword = async (req, res) => {
  const { new_password } = req.body;
  try {
    const hash = await bcrypt.hash(new_password || 'Password@123', 10);
    await db.query('UPDATE users SET password_hash=? WHERE user_id=?', [hash, req.params.id]);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

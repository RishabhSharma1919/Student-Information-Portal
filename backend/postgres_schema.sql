-- ============================================================
-- POSTGRES SCHEMA (Converted from MySQL)
-- ============================================================

-- DROP TABLES (in reverse order of dependencies)
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

-- TABLE: users
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'student', 'faculty')) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: departments
CREATE TABLE departments (
  dept_id SERIAL PRIMARY KEY,
  dept_name VARCHAR(100) NOT NULL UNIQUE,
  dept_code VARCHAR(10) NOT NULL UNIQUE
);

-- TABLE: faculty
CREATE TABLE faculty (
  faculty_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  dept_id INT NOT NULL REFERENCES departments(dept_id),
  designation VARCHAR(50) CHECK (designation IN ('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer')) NOT NULL,
  phone VARCHAR(15)
);

-- TABLE: students
CREATE TABLE students (
  student_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
  dept_id INT NOT NULL REFERENCES departments(dept_id),
  year_of_study INT NOT NULL DEFAULT 1,
  contact_phone VARCHAR(15),
  contact_address TEXT,
  roll_number VARCHAR(20) NOT NULL UNIQUE
);

-- TABLE: courses
CREATE TABLE courses (
  course_id SERIAL PRIMARY KEY,
  course_code VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(150) NOT NULL,
  credits INT NOT NULL DEFAULT 3,
  dept_id INT NOT NULL REFERENCES departments(dept_id),
  faculty_id INT REFERENCES faculty(faculty_id) ON DELETE SET NULL,
  semester INT NOT NULL DEFAULT 1,
  max_students INT DEFAULT 60
);

-- TABLE: enrollments
CREATE TABLE enrollments (
  enrollment_id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  semester INT NOT NULL,
  academic_year VARCHAR(10) NOT NULL DEFAULT '2024-25',
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Dropped', 'Completed')),
  UNIQUE (student_id, course_id, academic_year)
);

-- TABLE: results
CREATE TABLE results (
  result_id SERIAL PRIMARY KEY,
  enrollment_id INT NOT NULL UNIQUE REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
  marks_internal DECIMAL(5,2) DEFAULT NULL,
  marks_external DECIMAL(5,2) DEFAULT NULL,
  marks_total DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN marks_internal IS NOT NULL AND marks_external IS NOT NULL
    THEN marks_internal + marks_external
    ELSE NULL END
  ) STORED,
  grade VARCHAR(5) DEFAULT NULL,
  remarks TEXT,
  updated_by INT REFERENCES faculty(faculty_id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updated_at (Postgres way)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_results_modtime BEFORE UPDATE ON results FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================
-- SAMPLE DATA INSERTS
-- ============================================================

INSERT INTO departments (dept_name, dept_code) VALUES
('Computer Science', 'CS'),
('Mathematics', 'MATH'),
('Physics', 'PHY'),
('Electronics', 'ECE'),
('Civil Engineering', 'CIVIL');

INSERT INTO users (email, password_hash, role) VALUES
('admin@portal.edu',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('priya.sharma@portal.edu',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty'),
('rajesh.kumar@portal.edu',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty'),
('sunita.verma@portal.edu',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty'),
('anil.gupta@portal.edu',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty'),
('meena.joshi@portal.edu',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty'),
('vikram.singh@portal.edu',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty'),
('amit.patel@student.edu',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('neha.singh@student.edu',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('rahul.sharma@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('pooja.gupta@student.edu',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('arjun.mehta@student.edu',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('divya.rao@student.edu',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('karan.jain@student.edu',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('ananya.das@student.edu',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('rohit.yadav@student.edu',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('priya.nair@student.edu',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

INSERT INTO faculty (user_id, name, dept_id, designation, phone) VALUES
(2, 'Dr. Priya Sharma',  1, 'Professor',             '9876543201'),
(3, 'Prof. Rajesh Kumar',1, 'Associate Professor',   '9876543202'),
(4, 'Dr. Sunita Verma',  2, 'Professor',             '9876543203'),
(5, 'Prof. Anil Gupta',  3, 'Assistant Professor',   '9876543204'),
(6, 'Dr. Meena Joshi',   4, 'Professor',             '9876543205'),
(7, 'Prof. Vikram Singh',1, 'Lecturer',              '9876543206');

INSERT INTO students (user_id, name, date_of_birth, gender, dept_id, year_of_study, contact_phone, roll_number) VALUES
(8,  'Amit Patel',   '2002-03-15', 'Male',   1, 3, '9111111101', 'CS2022001'),
(9,  'Neha Singh',   '2003-07-22', 'Female', 1, 2, '9111111102', 'CS2023002'),
(10, 'Rahul Sharma', '2002-11-10', 'Male',   1, 3, '9111111103', 'CS2022003'),
(11, 'Pooja Gupta',  '2003-01-05', 'Female', 2, 2, '9111111104', 'MA2023004'),
(12, 'Arjun Mehta',  '2001-08-30', 'Male',   1, 4, '9111111105', 'CS2021005'),
(13, 'Divya Rao',    '2003-04-18', 'Female', 4, 2, '9111111106', 'EC2023006'),
(14, 'Karan Jain',   '2002-06-25', 'Male',   3, 3, '9111111107', 'PH2022007'),
(15, 'Ananya Das',   '2003-09-12', 'Female', 1, 2, '9111111108', 'CS2023008'),
(16, 'Rohit Yadav',  '2001-12-03', 'Male',   5, 4, '9111111109', 'CV2021009'),
(17, 'Priya Nair',   '2002-05-27', 'Female', 4, 3, '9111111110', 'EC2022010');

INSERT INTO courses (course_code, course_name, credits, dept_id, faculty_id, semester) VALUES
('CS301', 'Data Structures & Algorithms',  4, 1, 1, 5),
('CS302', 'Database Management Systems',   3, 1, 2, 5),
('CS303', 'Operating Systems',             3, 1, 6, 5),
('CS201', 'Object Oriented Programming',   4, 1, 1, 3),
('MA301', 'Discrete Mathematics',          3, 2, 3, 5),
('MA201', 'Calculus & Linear Algebra',     4, 2, 3, 3),
('PH301', 'Quantum Mechanics',             3, 3, 4, 5),
('EC301', 'Digital Electronics',           4, 4, 5, 5),
('EC302', 'Signals & Systems',             3, 4, 5, 5),
('CV301', 'Structural Analysis',           4, 5, NULL, 5);

INSERT INTO enrollments (student_id, course_id, semester, academic_year) VALUES
(1, 1, 5, '2024-25'), (1, 2, 5, '2024-25'), (1, 3, 5, '2024-25'),
(2, 1, 5, '2024-25'), (2, 2, 5, '2024-25'), (3, 1, 5, '2024-25'),
(3, 3, 5, '2024-25'), (5, 1, 5, '2024-25'), (5, 2, 5, '2024-25'),
(8, 1, 5, '2024-25'), (8, 2, 5, '2024-25'), (4, 5, 5, '2024-25'),
(4, 6, 3, '2024-25'), (7, 7, 5, '2024-25'), (6, 8, 5, '2024-25'),
(6, 9, 5, '2024-25'), (10, 8, 5, '2024-25'), (9, 10, 5, '2024-25');

INSERT INTO results (enrollment_id, marks_internal, marks_external, grade, remarks, updated_by) VALUES
(1, 38, 52, 'A',  'Excellent', 1), (2, 35, 48, 'B+', 'Good', 2),
(3, 30, 40, 'B',  'Satisfactory', 6), (4, 40, 58, 'A+', 'Outstanding', 1),
(5, 32, 45, 'B',  'Good', 2), (6, 28, 38, 'C+', 'Needs improvement', 1),
(7, 35, 50, 'A',  'Well done', 6), (8, 42, 55, 'A+', 'Exceptional', 1),
(9, 38, 50, 'A',  'Very good', 2), (10, 30, 42, 'B',  'Average', 1),
(11, 33, 46, 'B+', 'Good', 2), (12, 36, 50, 'A',  'Good', 3),
(14, 25, 35, 'C',  'Average', 4), (15, 40, 54, 'A+', 'Excellent', 5),
(16, 37, 48, 'A',  'Very good', 5), (17, 34, 46, 'B+', 'Good', 5);

CREATE DATABASE IF NOT EXISTS student_information_portal;
USE student_information_portal;

-- Admin Table
CREATE TABLE IF NOT EXISTS admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Student Table
CREATE TABLE IF NOT EXISTS student (
    student_id VARCHAR(8) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    department VARCHAR(30) NOT NULL,
    year_of_study INT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    home_address VARCHAR(255)
);

-- Course Table
CREATE TABLE IF NOT EXISTS course (
    course_id VARCHAR(6) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    department VARCHAR(30) NOT NULL
);

-- Enrollment Table
CREATE TABLE IF NOT EXISTS enrollment (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(8) NOT NULL,
    course_id VARCHAR(6) NOT NULL,
    
    FOREIGN KEY (student_id)
        REFERENCES student(student_id)
        ON DELETE CASCADE,

    FOREIGN KEY (course_id)
        REFERENCES course(course_id)
        ON DELETE CASCADE
);

-- Result Table
CREATE TABLE IF NOT EXISTS result (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id INT NOT NULL,
    grade VARCHAR(2) NOT NULL,

    FOREIGN KEY (enrollment_id)
        REFERENCES enrollment(enrollment_id)
        ON DELETE CASCADE
);

-- Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    department VARCHAR(30) NOT NULL,
    designation VARCHAR(50) NOT NULL
);
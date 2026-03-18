const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(verifyToken, requireRole('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Students
router.get('/students', adminController.getAllStudents);
router.get('/students/:id', adminController.getStudentById);
router.post('/students', adminController.createStudent);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Faculty
router.get('/faculty', adminController.getAllFaculty);
router.post('/faculty', adminController.createFaculty);
router.put('/faculty/:id', adminController.updateFaculty);
router.delete('/faculty/:id', adminController.deleteFaculty);

// Courses
router.get('/courses', adminController.getAllCourses);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Enrollments
router.get('/enrollments', adminController.getAllEnrollments);
router.post('/enrollments', adminController.createEnrollment);

// Results
router.get('/results', adminController.getAllResults);
router.put('/results/:id', adminController.updateResult);

// Departments
router.get('/departments', adminController.getDepartments);

// Users
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/reset-password', adminController.resetUserPassword);

module.exports = router;

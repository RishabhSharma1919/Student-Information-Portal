const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole('faculty'));

router.get('/profile', facultyController.getMyProfile);
router.get('/courses', facultyController.getMyCourses);
router.get('/courses/:courseId/students', facultyController.getCourseStudents);
router.get('/courses/:courseId/summary', facultyController.getCourseResultSummary);
router.put('/results/:resultId', facultyController.updateResult);

module.exports = router;

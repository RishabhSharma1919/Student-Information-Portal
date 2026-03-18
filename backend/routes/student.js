const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole('student'));

router.get('/profile', studentController.getMyProfile);
router.get('/enrollments', studentController.getMyEnrollments);
router.get('/results', studentController.getMyResults);
router.get('/results/summary', studentController.getMyResultSummary);

module.exports = router;

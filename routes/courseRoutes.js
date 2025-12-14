const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/all', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/category/:category', courseController.getCoursesByCategory);

// Protected routes (admin only)
router.post('/create', verifyAdminToken, courseController.createCourse);
router.put('/:id', verifyAdminToken, courseController.updateCourse);
router.delete('/:id', verifyAdminToken, courseController.deleteCourse);
router.get('/stats/all', verifyAdminToken, courseController.getCourseStats);

module.exports = router;

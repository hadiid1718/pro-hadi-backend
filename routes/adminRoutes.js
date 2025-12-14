const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

// Public route
router.post('/login', adminController.adminLogin);

// Protected routes (admin only)
router.get('/dashboard', verifyAdminToken, adminController.getAdminDashboard);
router.get('/all', verifyAdminToken, adminController.getAllAdmins);
router.post('/create', verifyAdminToken, adminController.createAdmin);
router.get('/users', verifyAdminToken, adminController.getAllUsersForAdmin);
router.delete('/users/:userId', verifyAdminToken, adminController.deleteUser);

module.exports = router;

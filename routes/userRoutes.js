const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { verifyUserToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', verifyUserToken, userController.getUserProfile);
router.put('/profile', verifyUserToken, userController.updateUserProfile);
router.get('/dashboard', verifyUserToken, userController.getUserDashboard);
router.get('/messages', verifyUserToken, userController.getUserMessages);
router.get('/settings', verifyUserToken, userController.getUserSettings);
router.put('/settings', verifyUserToken, userController.updateUserSettings);
router.get('/all', userController.getAllUsers);

module.exports = router;

const express = require('express');
const router = express.Router();
const workController = require('../controller/workController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/', workController.getAllWorks);
router.get('/featured', workController.getFeaturedWorks);
router.get('/category/:category', workController.getWorksByCategory);
router.get('/stats', workController.getWorkStats);
router.get('/:id', workController.getWorkById);

// Protected routes (admin only)
router.post('/', verifyAdminToken, workController.createWork);
router.put('/:id', verifyAdminToken, workController.updateWork);
router.delete('/:id', verifyAdminToken, workController.deleteWork);

module.exports = router;

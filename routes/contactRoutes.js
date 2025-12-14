const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

// Public route
router.post('/send', contactController.createContact);

// Public route for user to get their messages (must be before /:id to avoid conflict)
router.get('/user/:userEmail', contactController.getUserConversation);

// Protected routes (admin only)
router.get('/all', verifyAdminToken, contactController.getAllContacts);
router.get('/details/:contactId', verifyAdminToken, contactController.getContactWithReplies);
router.get('/stats/all', verifyAdminToken, contactController.getContactStats);
router.get('/:id', verifyAdminToken, contactController.getContactById);
router.put('/:id/status', verifyAdminToken, contactController.updateContactStatus);
router.put('/:id/reply', verifyAdminToken, contactController.sendReply);
router.delete('/:id', verifyAdminToken, contactController.deleteContact);

module.exports = router;

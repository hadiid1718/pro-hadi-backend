const express = require('express');
const router = express.Router();
const { 
  createService, 
  getAllServices, 
  getServiceById, 
  updateService, 
  deleteService, 
  getServiceStats 
} = require('../controller/serviceController');
const  {verifyAdminToken}  = require('../middleware/authMiddleware');

console.log('createService:', typeof createService);
console.log('getAllServices:', typeof getAllServices);
console.log('getServiceById:', typeof getServiceById);
console.log('updateService:', typeof updateService);
console.log('deleteService:', typeof deleteService);
console.log('getServiceStats:', typeof getServiceStats);
console.log('authMiddleware:', typeof authMiddleware);


// Public routes
router.get('/', getAllServices);
router.get('/stats', getServiceStats);
router.get('/:id', getServiceById);

// Admin protected routes
router.post('/', verifyAdminToken, createService);
router.put('/:id', verifyAdminToken, updateService);
router.delete('/:id', verifyAdminToken, deleteService);

module.exports = router;

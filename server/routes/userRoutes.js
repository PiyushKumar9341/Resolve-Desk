const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { 
  getUserProfile, 
  updateUserProfile, 
  getStudentsAdmin, 
  getStudentDetailsAdmin 
} = require('../controllers/userController');

// Admin Student Directory endpoints (registered before generic user endpoints)
router.get('/admin/students', protect, adminOnly, getStudentsAdmin);
router.get('/admin/students/:id', protect, adminOnly, getStudentDetailsAdmin);

// User Profile endpoints
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;

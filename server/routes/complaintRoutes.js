const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createComplaint,
  getMyComplaints,
  getStats,
  getAdminStats,
  getAllComplaintsAdmin,
  updateComplaintAdmin,
  getAdminAnalytics,
  toggleUpvote,
  getPublicComplaints,
  checkDuplicateComplaint
} = require('../controllers/complaintController');

// Student & Public endpoints
router.post('/', protect, createComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/stats', protect, getStats);
router.get('/public', protect, getPublicComplaints);
router.get('/check-duplicate', protect, checkDuplicateComplaint);
router.post('/:id/upvote', protect, toggleUpvote);

// Admin endpoints (strictly registered before any future /:id parameterized route)
router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.get('/admin/all', protect, adminOnly, getAllComplaintsAdmin);
router.get('/admin/analytics', protect, adminOnly, getAdminAnalytics);
router.put('/admin/:id', protect, adminOnly, updateComplaintAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createComplaint,
  getMyComplaints,
  getStats
} = require('../controllers/complaintController');

router.post('/', protect, createComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/stats', protect, getStats);

module.exports = router;

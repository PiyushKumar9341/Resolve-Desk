const Complaint = require('../models/Complaint');

// Helper to generate readable custom complaint ID (e.g. GRV-2026-4829)
function generateComplaintId() {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `GRV-${year}-${randomDigits}`;
}

// @desc    Submit a new grievance complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Complaint title is required.' });
    }

    const validCategories = ['Hostel', 'Academic', 'Faculty', 'Infrastructure', 'Other'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Please select a valid complaint category.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Complaint description is required.' });
    }

    let complaintId = generateComplaintId();
    // Ensure uniqueness
    let exists = await Complaint.findOne({ complaintId });
    while (exists) {
      complaintId = generateComplaintId();
      exists = await Complaint.findOne({ complaintId });
    }

    const complaint = await Complaint.create({
      complaintId,
      studentId: req.user._id,
      title: title.trim(),
      category,
      description: description.trim(),
      status: 'Pending'
    });

    console.log(`[Complaint Created] ID: ${complaintId} by Student: ${req.user.email}`);

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint
    });
  } catch (error) {
    console.error('[Create Complaint Error]', error);
    return res.status(500).json({ message: 'Server error while submitting complaint.' });
  }
};

// @desc    Get all complaints belonging to logged-in student
// @route   GET /api/complaints/my
// @access  Private (Student)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    console.error('[Get My Complaints Error]', error);
    return res.status(500).json({ message: 'Server error while fetching your complaints.' });
  }
};

// @desc    Get complaint stats for logged-in student dashboard
// @route   GET /api/complaints/stats
// @access  Private (Student)
const getStats = async (req, res) => {
  try {
    const studentId = req.user._id;

    const total = await Complaint.countDocuments({ studentId });
    const pending = await Complaint.countDocuments({ studentId, status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ studentId, status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ studentId, status: 'Resolved' });

    return res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved
      }
    });
  } catch (error) {
    console.error('[Get Stats Error]', error);
    return res.status(500).json({ message: 'Server error while calculating statistics.' });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getStats
};

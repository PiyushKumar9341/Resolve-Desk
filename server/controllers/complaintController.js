const Complaint = require('../models/Complaint');
const User = require('../models/User');

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
    const { title, category, subCategory, blockLocation, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Complaint title is required.' });
    }

    const validCategories = ['Hostel', 'Academic', 'Infrastructure', 'Canteen & Mess', 'Other'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Please select a valid complaint category.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Complaint description is required.' });
    }

    let complaintId = generateComplaintId();
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
      subCategory: subCategory || 'General',
      blockLocation: blockLocation || 'Other',
      description: description.trim(),
      status: 'Pending',
      priority: 'Medium',
      upvotes: []
    });

    console.log(`[Complaint Created] ID: ${complaintId} by Student: ${req.user.email} (Block: ${blockLocation || 'Other'})`);

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

// @desc    Toggle upvote (+1 / Me Too) on a complaint & recalculate auto-priority
// @route   POST /api/complaints/:id/upvote
// @access  Private (Student & Admin)
const toggleUpvote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint record not found.' });
    }

    if (!complaint.upvotes) {
      complaint.upvotes = [];
    }

    const upvoteIndex = complaint.upvotes.findIndex(
      (uid) => uid.toString() === userId.toString()
    );

    let hasUpvoted = false;
    if (upvoteIndex > -1) {
      complaint.upvotes.splice(upvoteIndex, 1);
      hasUpvoted = false;
    } else {
      complaint.upvotes.push(userId);
      hasUpvoted = true;
    }

    // Smart Auto-Priority Threshold Engine
    const count = complaint.upvotes.length;
    if (count >= 15) {
      complaint.priority = 'Urgent';
    } else if (count >= 5) {
      complaint.priority = 'High';
    } else if (complaint.priority === 'High' || complaint.priority === 'Urgent') {
      complaint.priority = 'Medium';
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      hasUpvoted,
      upvoteCount: complaint.upvotes.length,
      priority: complaint.priority,
      message: hasUpvoted ? 'Upvoted successfully!' : 'Upvote removed.'
    });
  } catch (error) {
    console.error('[Toggle Upvote Error]', error);
    return res.status(500).json({ message: 'Server error while toggling upvote.' });
  }
};

// @desc    Get all public campus complaints for Campus Feed
// @route   GET /api/complaints/public
// @access  Private (Student & Admin)
const getPublicComplaints = async (req, res) => {
  try {
    const {
      search = '',
      category = 'All',
      block = 'All',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (block && block !== 'All') {
      query.blockLocation = block;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { complaintId: { $regex: term, $options: 'i' } },
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { subCategory: { $regex: term, $options: 'i' } }
      ];
    }

    const total = await Complaint.countDocuments(query);
    const docs = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('studentId', 'name email');

    const formatted = docs.map((c) => {
      const upvotesList = c.upvotes || [];
      const hasUpvoted = req.user ? upvotesList.some(id => id.toString() === req.user._id.toString()) : false;

      return {
        _id: c._id,
        complaintId: c.complaintId,
        title: c.title,
        category: c.category,
        subCategory: c.subCategory || 'General',
        blockLocation: c.blockLocation || 'Other',
        description: c.description,
        status: c.status,
        priority: c.priority || 'Medium',
        adminRemark: c.adminRemark || '',
        createdAt: c.createdAt,
        studentName: c.studentId?.name || 'Student',
        studentEmail: c.studentId?.email || 'N/A',
        upvoteCount: upvotesList.length,
        hasUpvoted
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      complaints: formatted
    });
  } catch (error) {
    console.error('[Get Public Complaints Error]', error);
    return res.status(500).json({ message: 'Server error while fetching campus feed.' });
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

// @desc    Get portal-wide stats and recent activity for Admin Dashboard
// @route   GET /api/complaints/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });

    // Urgent complaints requiring action
    const urgent = await Complaint.countDocuments({
      priority: 'Urgent',
      status: { $in: ['Pending', 'In Progress'] }
    });

    // Aggregated Category breakdown
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const categories = ['Hostel', 'Academic', 'Faculty', 'Infrastructure', 'Other'];
    const categoryCounts = categories.map(cat => {
      const match = categoryStats.find(c => c._id === cat);
      return { category: cat, count: match ? match.count : 0 };
    });

    // Recent 5 complaints across portal
    const recentDocs = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'name email');

    const recentComplaints = recentDocs.map(doc => ({
      _id: doc._id,
      complaintId: doc.complaintId,
      title: doc.title,
      category: doc.category,
      status: doc.status,
      priority: doc.priority || 'Medium',
      studentName: doc.studentId?.name || 'Student',
      studentEmail: doc.studentId?.email || 'N/A',
      createdAt: doc.createdAt
    }));

    return res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        rejected,
        urgent
      },
      categoryCounts,
      recentComplaints
    });
  } catch (error) {
    console.error('[Get Admin Stats Error]', error);
    return res.status(500).json({ message: 'Server error while calculating admin statistics.' });
  }
};

// @desc    Get all complaints with pagination, filtering, searching, and sorting
// @route   GET /api/complaints/admin/all
// @access  Private (Admin only)
const getAllComplaintsAdmin = async (req, res) => {
  try {
    const {
      search = '',
      status = 'All',
      category = 'All',
      priority = 'All',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by priority (Approach A: defensively treating missing/null as 'Medium')
    if (priority === 'Medium') {
      query.$or = [
        { priority: 'Medium' },
        { priority: { $exists: false } },
        { priority: null }
      ];
    } else if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search by title, complaintId, or student name/email
    if (search && search.trim()) {
      const term = search.trim();
      const studentMatches = await User.find({
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { email: { $regex: term, $options: 'i' } }
        ]
      }).select('_id');

      const studentIds = studentMatches.map(s => s._id);

      const searchConditions = [
        { complaintId: { $regex: term, $options: 'i' } },
        { title: { $regex: term, $options: 'i' } },
        { studentId: { $in: studentIds } }
      ];

      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: searchConditions }
        ];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    let complaints;
    const total = await Complaint.countDocuments(query);

    if (sortBy === 'priority') {
      const direction = sortOrder === 'asc' ? 1 : -1;
      complaints = await Complaint.aggregate([
        { $match: query },
        {
          $addFields: {
            priorityScore: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'Urgent'] }, then: 4 },
                  { case: { $eq: ['$priority', 'High'] }, then: 3 },
                  { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                  { case: { $eq: ['$priority', 'Low'] }, then: 1 }
                ],
                default: 2 // Treat missing/legacy documents as Medium (score 2)
              }
            }
          }
        },
        { $sort: { priorityScore: direction, createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            complaintId: 1,
            title: 1,
            category: 1,
            description: 1,
            status: 1,
            priority: 1,
            department: 1,
            assignedStaff: 1,
            adminRemark: 1,
            statusHistory: 1,
            createdAt: 1,
            updatedAt: 1,
            studentId: {
              _id: '$student._id',
              name: '$student.name',
              email: '$student.email'
            }
          }
        }
      ]);
    } else {
      const sortObj = {};
      sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

      complaints = await Complaint.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('studentId', 'name email');
    }

    const formatted = complaints.map(c => ({
      _id: c._id,
      complaintId: c.complaintId,
      title: c.title,
      category: c.category,
      description: c.description,
      status: c.status,
      priority: c.priority || 'Medium',
      department: c.department || '',
      assignedStaff: c.assignedStaff || '',
      adminRemark: c.adminRemark || '',
      statusHistory: c.statusHistory || [],
      studentName: c.studentId?.name || 'Student',
      studentEmail: c.studentId?.email || 'N/A',
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      complaints: formatted
    });
  } catch (error) {
    console.error('[Get All Complaints Admin Error]', error);
    return res.status(500).json({ message: 'Server error while fetching grievances.' });
  }
};

// @desc    Update complaint status, priority, admin remark, department, assigned staff
// @route   PUT /api/complaints/admin/:id
// @access  Private (Admin only)
const updateComplaintAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, adminRemark, department, assignedStaff } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint record not found.' });
    }

    // Enum validation
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status '${status}'. Status must be one of: ${validStatuses.join(', ')}.`
      });
    }

    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: `Invalid priority '${priority}'. Priority must be one of: ${validPriorities.join(', ')}.`
      });
    }

    // Update status and append to statusHistory if status changed
    if (status && status !== complaint.status) {
      complaint.status = status;

      if (!complaint.statusHistory) {
        complaint.statusHistory = [];
      }

      complaint.statusHistory.push({
        status,
        remark: adminRemark !== undefined ? adminRemark : (complaint.adminRemark || ''),
        changedBy: req.user._id,
        changedAt: new Date()
      });
    }

    if (priority) complaint.priority = priority;
    if (adminRemark !== undefined) complaint.adminRemark = adminRemark;
    if (department !== undefined) complaint.department = department;
    if (assignedStaff !== undefined) complaint.assignedStaff = assignedStaff;

    await complaint.save();

    // Re-fetch with populated student and statusHistory changedBy details
    const updatedDoc = await Complaint.findById(complaint._id)
      .populate('studentId', 'name email')
      .populate('statusHistory.changedBy', 'name email role');

    const formattedComplaint = {
      _id: updatedDoc._id,
      complaintId: updatedDoc.complaintId,
      title: updatedDoc.title,
      category: updatedDoc.category,
      description: updatedDoc.description,
      status: updatedDoc.status,
      priority: updatedDoc.priority || 'Medium',
      department: updatedDoc.department || '',
      assignedStaff: updatedDoc.assignedStaff || '',
      adminRemark: updatedDoc.adminRemark || '',
      statusHistory: updatedDoc.statusHistory || [],
      studentName: updatedDoc.studentId?.name || 'Student',
      studentEmail: updatedDoc.studentId?.email || 'N/A',
      createdAt: updatedDoc.createdAt,
      updatedAt: updatedDoc.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: 'Grievance record updated successfully.',
      complaint: formattedComplaint
    });
  } catch (error) {
    console.error('[Update Complaint Admin Error]', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid complaint ID format.' });
    }
    return res.status(500).json({ message: 'Server error while updating complaint record.' });
  }
};

// @desc    Get portal-wide analytics, resolution metrics, distribution & trends
// @route   GET /api/complaints/admin/analytics
// @access  Private (Admin only)
const getAdminAnalytics = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingCount = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressCount = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedCount = await Complaint.countDocuments({ status: 'Resolved' });
    const rejectedCount = await Complaint.countDocuments({ status: 'Rejected' });

    // Resolution rate percentage
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0;

    // Average resolution time in days (for resolved complaints)
    const resolvedDocs = await Complaint.find({ status: 'Resolved' });
    let totalDays = 0;
    if (resolvedDocs.length > 0) {
      resolvedDocs.forEach(doc => {
        const diffMs = new Date(doc.updatedAt) - new Date(doc.createdAt);
        const diffDays = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
      });
    }
    const avgResolutionDays = resolvedDocs.length > 0 ? (totalDays / resolvedDocs.length).toFixed(1) : '0.0';

    // Priority Distribution
    const urgentCount = await Complaint.countDocuments({ priority: 'Urgent' });
    const highCount = await Complaint.countDocuments({ priority: 'High' });
    const lowCount = await Complaint.countDocuments({ priority: 'Low' });
    // Medium count includes legacy documents missing priority field
    const mediumCount = await Complaint.countDocuments({
      $or: [{ priority: 'Medium' }, { priority: { $exists: false } }, { priority: null }]
    });

    // Category Distribution & Category Resolution Rates
    const categories = ['Hostel', 'Academic', 'Faculty', 'Infrastructure', 'Other'];
    const categoryAnalytics = await Promise.all(
      categories.map(async (cat) => {
        const total = await Complaint.countDocuments({ category: cat });
        const resolved = await Complaint.countDocuments({ category: cat, status: 'Resolved' });
        const pending = await Complaint.countDocuments({ category: cat, status: 'Pending' });
        const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        return {
          category: cat,
          total,
          resolved,
          pending,
          resolutionRate: rate
        };
      })
    );

    // 14-day Submission Trend
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const trendDocs = await Complaint.find({ createdAt: { $gte: fourteenDaysAgo } }).select('createdAt');

    const trendMap = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trendMap[key] = 0;
    }

    trendDocs.forEach(doc => {
      const key = new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (trendMap[key] !== undefined) {
        trendMap[key]++;
      }
    });

    const submissionTrend = Object.keys(trendMap).map(dateKey => ({
      date: dateKey,
      count: trendMap[dateKey]
    }));

    return res.status(200).json({
      success: true,
      analytics: {
        totalComplaints,
        resolutionRate,
        avgResolutionDays,
        statusDistribution: {
          pending: pendingCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
          rejected: rejectedCount
        },
        priorityDistribution: {
          urgent: urgentCount,
          high: highCount,
          medium: mediumCount,
          low: lowCount
        },
        categoryAnalytics,
        submissionTrend
      }
    });
  } catch (error) {
    console.error('[Get Admin Analytics Error]', error);
    return res.status(500).json({ message: 'Server error while calculating analytics.' });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getStats,
  getAdminStats,
  getAllComplaintsAdmin,
  updateComplaintAdmin,
  getAdminAnalytics,
  toggleUpvote,
  getPublicComplaints
};



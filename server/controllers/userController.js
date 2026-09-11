const User = require('../models/User');
const Complaint = require('../models/Complaint');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('[Get User Profile Error]', error);
    return res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

// @desc    Update student display name
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Display name cannot be empty.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.name = name.trim();
    await user.save();

    console.log(`[Profile Updated] User ${user.email} changed name to: "${user.name}"`);

    return res.status(200).json({
      success: true,
      message: 'Profile name updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('[Update User Profile Error]', error);
    return res.status(500).json({ message: 'Server error while updating profile.' });
  }
};

// @desc    Get all students with complaint metrics and search
// @route   GET /api/users/admin/students
// @access  Private (Admin only)
const getStudentsAdmin = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const query = { role: 'student' };
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } }
      ];
    }

    const totalStudents = await User.countDocuments(query);
    const students = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const studentListWithCounts = await Promise.all(
      students.map(async (student) => {
        const total = await Complaint.countDocuments({ studentId: student._id });
        const pending = await Complaint.countDocuments({ studentId: student._id, status: 'Pending' });
        const inProgress = await Complaint.countDocuments({ studentId: student._id, status: 'In Progress' });
        const resolved = await Complaint.countDocuments({ studentId: student._id, status: 'Resolved' });
        const rejected = await Complaint.countDocuments({ studentId: student._id, status: 'Rejected' });

        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
          createdAt: student.createdAt,
          complaintStats: {
            total,
            pending,
            inProgress,
            resolved,
            rejected
          }
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: studentListWithCounts.length,
      total: totalStudents,
      page: pageNum,
      totalPages: Math.ceil(totalStudents / limitNum) || 1,
      students: studentListWithCounts
    });
  } catch (error) {
    console.error('[Get Students Admin Error]', error);
    return res.status(500).json({ message: 'Server error while fetching student directory.' });
  }
};

// @desc    Get single student details with all grievances filed by them
// @route   GET /api/users/admin/students/:id
// @access  Private (Admin only)
const getStudentDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id).select('-__v');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student record not found.' });
    }

    const complaints = await Complaint.find({ studentId: student._id }).sort({ createdAt: -1 });

    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const rejected = complaints.filter(c => c.status === 'Rejected').length;

    const formattedComplaints = complaints.map(c => ({
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
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));

    return res.status(200).json({
      success: true,
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        createdAt: student.createdAt,
        complaintStats: {
          total,
          pending,
          inProgress,
          resolved,
          rejected
        }
      },
      complaints: formattedComplaints
    });
  } catch (error) {
    console.error('[Get Student Details Admin Error]', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid student ID format.' });
    }
    return res.status(500).json({ message: 'Server error while fetching student details.' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getStudentsAdmin,
  getStudentDetailsAdmin
};

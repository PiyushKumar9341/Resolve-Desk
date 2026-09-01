const User = require('../models/User');

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

module.exports = {
  getUserProfile,
  updateUserProfile
};

const Notification = require('../models/Notification');

// Helper function to create notification internally
const createNotificationHelper = async ({ recipient, sender = null, complaint = null, title, message, type = 'system' }) => {
  try {
    if (!recipient) return null;
    const notif = await Notification.create({
      recipient,
      sender,
      complaint,
      title,
      message,
      type
    });
    return notif;
  } catch (error) {
    console.error('[Create Notification Helper Error]', error);
    return null;
  }
};

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'name email role')
      .populate('complaint', 'complaintId title category status')
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error('[Get Notifications Error]', error);
    return res.status(500).json({ message: 'Server error fetching notifications.' });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: id, recipient: userId });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    notification.isRead = true;
    await notification.save();

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      unreadCount,
      notification
    });
  } catch (error) {
    console.error('[Mark Notification Read Error]', error);
    return res.status(500).json({ message: 'Server error marking notification read.' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
      unreadCount: 0
    });
  } catch (error) {
    console.error('[Mark All Read Error]', error);
    return res.status(500).json({ message: 'Server error marking all read.' });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notif = await Notification.findOneAndDelete({ _id: id, recipient: userId });
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      message: 'Notification deleted.',
      unreadCount
    });
  } catch (error) {
    console.error('[Delete Notification Error]', error);
    return res.status(500).json({ message: 'Server error deleting notification.' });
  }
};

module.exports = {
  createNotificationHelper,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

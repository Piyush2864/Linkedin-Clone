const { Notification, User } = require('../models');

/**
 * Send real-time notification to user & save to database
 */
const sendNotification = async (userId, senderId, type, message) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      sender_id: senderId,
      type: type,
      message: message,
    });

    // Emit real-time socket event if Socket.IO is initialized
    if (global.io) {
      global.io.emit(`notification_${userId}`, notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const getAllNotification = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { user_id: userId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'email', 'profile_picture'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Fetch all notifications successfully.',
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  sendNotification,
  getAllNotification,
  markNotificationAsRead,
};
const Notification = require('../models/notification.js');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id, read: false },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};


module.exports = {
    getNotifications,
}

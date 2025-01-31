const { Notification, User } = require('../models/notification.js');



const createNotification = async (req, res) => {
    try {
        const { userId, type, message } = req.body;
    
        // Create a new notification
        const notification = await Notification.create({
          user_id: userId,  
          type: type, 
          message: message,  
        });
    
        res.status(201).json({
          success: true,
          message: 'Notification created successfully!',
          data: notification,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
      }
}


const getAllNotification = async (req, res) => {
    try {
        const userId = req.user.id;


        const notifications = await Notification.findAll({
            where: { user_id: userId },
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
            ],
        });

        if (notifications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No notifications found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Fetch all notification successfully.',
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const markNotificationAsRead = async(req, res)=> {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id; 
    
        
        const notification = await Notification.findOne({
          where: { id: notificationId, user_id: userId },
        });
    
        if (!notification) {
          return res.status(404).json({ 
            success: false,
            message: 'Notification not found' });
        }
    
       
        notification.is_read = true;
        await notification.save();
    
        res.status(200).json({ 
            success: true,
            message: 'Notification marked as read',
            data: notification 
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
}

module.exports = {
    createNotification,
    getAllNotification,
    markNotificationAsRead
}
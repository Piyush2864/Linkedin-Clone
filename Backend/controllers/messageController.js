const { Op } = require('sequelize');
const { Notification } = require('../models/notification.js');
const { Message } = require('../models/message.js');

const onlineUsers = new Map(); 

// const activeUsers = new Map(); // Map to track online users

const sendMessageController = async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        const sender_id = req.user.id;

        
        const isDelivered = activeUsers.has(receiver_id);

        
        const message = await Message.create({ 
            sender_id, 
            receiver_id, 
            content, 
            is_delivered: isDelivered,
        });

       
        const notification = await Notification.create({
            user_id: receiver_id,
            sender_id: sender_id,
            type: 'message',
            message: `New message from User ${sender_id}`,
        });

        
        const receiverSocket = activeUsers.get(receiver_id);
        if (receiverSocket) {
            io.to(receiverSocket).emit('receive_message', message);
            io.to(receiverSocket).emit('message_delivered', message.id);
            io.to(receiverSocket).emit('new_notification', {
                type: 'message',
                message: `New message from User ${sender_id}`,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });

    } catch (error) {
        console.error("Error in sendMessageController:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};


const getChatHistoryController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: currentUserId, receiver_id: userId },
                    { sender_id: userId, receiver_id: currentUserId },
                ],
            },
            order: [['createdAt', 'ASC']],
        });

        res.status(200).json({
            success: true,
            message: 'Chat history fetched successfully',
            data: messages
        });

    } catch (error) {
        console.error("Error in getChatHistoryController:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};


const markAsReadController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user.id;

        
        await Message.update(
            { is_read: true },
            {
                where: {
                    sender_id: userId,
                    receiver_id: currentUserId,
                    is_read: false,
                },
            }
        );

        
        const senderSocket = onlineUsers.get(userId);
        if (senderSocket) {
            global.io.to(senderSocket).emit('message_seen', { sender_id: currentUserId });
        }

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });

    } catch (error) {
        console.error("Error in markAsReadController:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};


const startTypingController = (req, res) => {
    try {
        const { receiver_id } = req.body;
        const sender_id = req.user.id;

        const receiverSocket = onlineUsers.get(receiver_id);
        if (receiverSocket) {
            global.io.to(receiverSocket).emit('user_typing', { sender_id });
        }

        res.status(200).json({
            success: true,
            message: 'Typing event emitted'
        });

    } catch (error) {
        console.error("Error in startTypingController:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const stopTypingController = (req, res) => {
    try {
        const { receiver_id } = req.body;
        const sender_id = req.user.id;

        const receiverSocket = onlineUsers.get(receiver_id);
        if (receiverSocket) {
            global.io.to(receiverSocket).emit('user_stopped_typing', { sender_id });
        }

        res.status(200).json({
            success: true,
            message: 'Stopped typing event emitted'
        });

    } catch (error) {
        console.error("Error in stopTypingController:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

module.exports = {
    sendMessageController,
    getChatHistoryController,
    markAsReadController,
    startTypingController,
    stopTypingController
};

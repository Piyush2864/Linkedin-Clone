const { Op } = require('sequelize');
const { Message, User } = require('../models/index.js');
const { sendNotification } = require('../utils/notification.js');

const sendMessageController = async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        const sender_id = req.user.id;

        const message = await Message.create({
            sender_id,
            receiver_id,
            content,
            is_delivered: false,
        });

        sendNotification(receiver_id, sender_id, 'message', `New message received`);

        if (global.io) {
            global.io.emit(`chat_${receiver_id}`, message);
            global.io.emit(`chat_${sender_id}`, message);
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
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'profile_picture'] },
                { model: User, as: 'receiver', attributes: ['id', 'name', 'profile_picture'] },
            ],
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

        if (global.io) {
            global.io.emit(`message_read_${userId}`, { read_by: currentUserId });
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

        if (global.io) {
            global.io.emit(`typing_${receiver_id}`, { sender_id });
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

        if (global.io) {
            global.io.emit(`stop_typing_${receiver_id}`, { sender_id });
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

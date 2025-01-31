const { User } = require('../models/user.js');
const { Message } = require('../models/message.js');



const sendMessageController = async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        const sender_id = req.user.id;

        const message = await Message.create({
            sender_id,
            receiver_id,
            content,
        });

        res.status(201).json({
            success: true,
            message: 'Message sent',
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


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
            messages: 'Fetch history between two users.',
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const markAsReadController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user.id;

        const message = await Message.update(
            { is_read: true },
            {
                where: {
                    sender_id: userId,
                    receiver_id: currentUserId,
                    is_read: false,
                },
            }
        );

        res.status(200).json({
            success: true,
            message: 'Messages marked as read',
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    sendMessageController,
    getChatHistoryController,
    markAsReadController
}
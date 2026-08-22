const { GroupMessage } = require('../models/groupMessage.js');
const { Group } = require('../models/group.js');



const sendMessageInGroupController = async (req, res) => {
    try {
        const { content } = req.body;
        const sender_id = req.user.id;
        const group_id = req.params.groupId;

        const message = await GroupMessage.create({ group_id, sender_id, content });

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


const getAllMessageFromGroupController = async (req, res) => {
    try {
        const group_id = req.params.groupId;

        const messages = await GroupMessage.findAll({
            where: { group_id },
            include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
            order: [['createdAt', 'ASC']],
        });

        res.status(200).json({
            success: true,
            messages: 'Fetch all group messages successfully.',
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    sendMessageInGroupController,
    getAllMessageFromGroupController,
}
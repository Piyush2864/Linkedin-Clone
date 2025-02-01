const { Group } = require('../models/group.js');



const createNewGroupController = async (req, res) => {
    try {
        const { name, members } = req.body;
        const creator_id = req.user.id;

        const group = await Group.create({ name, creator_id });

        await group.addUsers(members);

        res.status(201).json({
            success: true,
            message: 'Group created successfully',
            data: group
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getAllGroupController = async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [{ model: User, where: { id: req.user.id }, attributes: [] }],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all groups for user successfully.',
            data: groups
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    createNewGroupController,
    getAllGroupController
}
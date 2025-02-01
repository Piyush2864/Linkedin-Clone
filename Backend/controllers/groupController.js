const { Group } = require('../models/group.js');
const { GroupMember } = require('../models/groupMember.js');



const createNewGroupController = async (req, res) => {
    try {
        const { name, members } = req.body;
        const creator_id = req.user.id;


        const group = await Group.create({ name, creator_id });


        await GroupMember.create({ group_id: group.id, user_id: creator_id, is_admin: true });


        const memberEntries = members.map((userId) => ({
            group_id: group.id,
            user_id: userId,
            is_admin: false,
        }));

        if (memberEntries.length > 0) {
            await GroupMember.bulkCreate(memberEntries);
        }

        res.status(201).json({
            success: true,
            message: 'Group created successfully',
            data: group
        });
    } catch (error) {
        console.error('Error in createNewGroupController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};


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


const userAddedByAdminController = async (req, res) => {
    try {
        const { user_id } = req.body;
        const group_id = req.params.groupId;
        const admin_id = req.user.id;


        const admin = await GroupMember.findOne({
            where: { group_id, user_id: admin_id, is_admin: true },
        });

        if (!admin) {
            return res.status(403).json({
                success: false,
                message: 'Only admins can add users'
            });
        }


        await GroupMember.create({ group_id, user_id, is_admin: false });

        res.status(200).json({
            success: true,
            message: 'User added to the group',
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const removeUserByAdminController = async (req, res) => {
    try {
        const group_id = req.params.groupId;
        const user_id = req.params.userId;
        const admin_id = req.user.id;


        const admin = await GroupMember.findOne({
            where: { group_id, user_id: admin_id, is_admin: true },
        });

        if (!admin) {
            return res.status(403).json({
                success: false,
                message: 'Only admins can remove users'
            });
        }


        await GroupMember.destroy({ where: { group_id, user_id } });

        res.status(200).json({
            success: true,
            message: 'User removed from the group',
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const changeUserToAdminController = async (req, res) => {
    try {
        const group_id = req.params.groupId;
        const user_id = req.params.userId;
        const requester_id = req.user.id;


        const group = await Group.findByPk(group_id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }


        if (group.creator_id !== requester_id) {
            return res.status(403).json({
                success: false,
                message: 'Only the group creator can promote admins'
            });
        }


        await GroupMember.update({ is_admin: true }, { where: { group_id, user_id } });

        res.status(200).json({
            success: true,
            message: 'User promoted to admin',
            data: group
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
    getAllGroupController,
    userAddedByAdminController,
    removeUserByAdminController,
    changeUserToAdminController
}
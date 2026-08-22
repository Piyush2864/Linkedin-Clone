const { User } = require('../models/user.js');
const { Op } = require('sequelize');



const getAllUsersController = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            success: true,
            message: 'Fetch all users successfully.',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const deleteUsersController = async (req, res) => {
    try {
        const userId = req.params.userId;


        const admin = await User.findByPk(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can delete users'
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.destroy();
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const searchUsersController = async (req, res) => {
    try {
        const { query, role, location, skills, experience, sortBy, order, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let whereCondition = {};
        
        
        if (query) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } },
            ];
        }

        if (role) whereCondition.role = role;
        if (location) whereCondition.location = { [Op.like]: `%${location}%` };
        if (skills) whereCondition.skills = { [Op.like]: `%${skills}%` };
        if (experience) whereCondition.experience = { [Op.gte]: experience };

        
        const users = await User.findAndCountAll({
            where: whereCondition,
            order: [[sortBy || 'createdAt', order || 'DESC']], 
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.status(200).json({
            success: true,
            total: users.count,
            users: users.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error
        });
    }
};


module.exports = {
    getAllUsersController,
    deleteUsersController,
    searchUsersController,
}  
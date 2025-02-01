const { User } = require('../models/user.js');
const { Job } = require('../models/job.js');
const { Post } = require('../models/post.js')
const { Op } = require('sequelize');


const dashboardController = async (req, res) => {
    try {

        const totalUsers = await User.count();
        const totalJobs = await Job.count();
        const totalPosts = await Post.count();


        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsers = await User.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } });
        const newJobs = await Job.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } });

        res.status(200).json({
            success: true,
            message: 'Dashboard data fetch successfully.',
            totalUsers,
            totalJobs,
            totalPosts,
            newUsers,
            newJobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    dashboardController,
}
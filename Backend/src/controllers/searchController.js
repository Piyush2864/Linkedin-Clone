const { Post, Job } = require('../models/post.js');
const { User } = require('../models/user.js')
const { Op } = require('sequelize');



const searchPostController = async (req, res) => {
    try {
        const { query } = req.query;


        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter is required'
            });
        }


        const posts = await Post.findAll({
            where: {
                content: {
                    [Op.like]: `%${query}%`,
                },
            },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
            ],
        });


        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                ],
            },
            attributes: ['id', 'name', 'email'],
        });


        const jobs = await Job.findAll({
            where: {
                title: {
                    [Op.like]: `%${query}%`,
                },
            },
        });


        res.status(200).json({ posts, users, jobs });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const advacedsearchController = async (req, res) => {
    try {
        const { query, filter, sort, page = 1, limit = 10 } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter is required'
            });
        }

        const offset = (page - 1) * limit;

        let postFilter = {};
        let userFilter = {};
        let jobFilter = {};

        if (filter === 'location') {
            userFilter.location = { [Op.like]: `%${query}%` };
        } else if (filter === 'skills') {
            userFilter.skills = { [Op.like]: `%${query}%` };
        } else if (filter === 'company') {
            jobFilter.company_name = { [Op.like]: `%${query}%` };
        } else if (filter === 'jobLocation') {
            jobFilter.location = { [Op.like]: `%${query}%` };
        } else {

            postFilter.content = { [Op.like]: `%${query}%` };
            userFilter[Op.or] = [
                { name: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } },
            ];
            jobFilter.title = { [Op.like]: `%${query}%` };
        }


        let order = [];
        if (sort === 'name') {
            order.push(['name', 'ASC']);
        } else if (sort === 'date') {
            order.push(['createdAt', 'DESC']);
        }


        const posts = await Post.findAll({
            where: postFilter,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        });


        const users = await User.findAll({
            where: userFilter,
            attributes: ['id', 'name', 'email', 'location', 'skills'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order,
        });


        const jobs = await Job.findAll({
            where: jobFilter,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order,
        });


        res.status(200).json({
            success: true,
            data: posts, users, jobs, page, limit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const autoCompleteController = async (req, res) => {
    try {
        const { query, type } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter is required'
            });
        }

        let results = [];

        if (type === 'user') {
            results = await User.findAll({
                where: { name: { [Op.like]: `%${query}%` } },
                attributes: ['id', 'name'],
                limit: 5,
            });
        } else if (type === 'post') {
            results = await Post.findAll({
                where: { content: { [Op.like]: `%${query}%` } },
                attributes: ['id', 'content'],
                limit: 5,
            });
        } else if (type === 'job') {
            results = await Job.findAll({
                where: { title: { [Op.like]: `%${query}%` } },
                attributes: ['id', 'title'],
                limit: 5,
            });
        }

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    searchPostController,
    advacedsearchController,
    autoCompleteController
};
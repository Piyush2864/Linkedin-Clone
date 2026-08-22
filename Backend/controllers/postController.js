const { Post, Like, Comment, User } = require('../models');

const createPostController = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const mediaurl = req.file ? `/uploads/${req.file.filename}` : null;

        const post = await Post.create({
            content,
            media_url: mediaurl,
            user_id: userId,
        });

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getAllPostController = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'profile_picture', 'headline'] },
                { model: Like, as: 'likesList', attributes: ['user_id'] },
                { model: Comment, as: 'commentsList', attributes: ['id', 'content', 'user_id'] },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all posts successfully',
            posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const postSharingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { content } = req.body;
        const sharedPostId = req.params.postId;

        const originalPost = await Post.findByPk(sharedPostId);
        if (!originalPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const newPost = await Post.create({
            content,
            user_id: userId,
            shared_post_id: sharedPostId,
        });

        res.status(201).json({
            success: true,
            message: 'Post shared successfully',
            data: newPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getAllSharedPostController = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { shared_post_id: { [require('sequelize').Op.ne]: null } },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'profile_picture'] },
                { model: Post, as: 'sharedPost', include: [{ model: User, as: 'user', attributes: ['id', 'name'] }] },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all shared posts successfully',
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    createPostController,
    getAllPostController,
    postSharingController,
    getAllSharedPostController,
};
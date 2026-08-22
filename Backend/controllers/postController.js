const { Post, Like, Comment, User, SavedPost } = require('../models');
const { Op } = require('sequelize');

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
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        const whereCondition = search
            ? { content: { [Op.like]: `%${search}%` } }
            : {};

        const { count, rows: posts } = await Post.findAndCountAll({
            where: whereCondition,
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'profile_picture', 'headline'] },
                { model: Like, as: 'likesList', attributes: ['user_id'] },
                { model: Comment, as: 'commentsList', attributes: ['id', 'content', 'user_id'] },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all posts successfully',
            posts,
            pagination: {
                totalPosts: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getPostByIdController = async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findByPk(postId, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'profile_picture', 'headline'] },
                { model: Like, as: 'likesList', attributes: ['user_id'] },
                { model: Comment, as: 'commentsList', attributes: ['id', 'content', 'user_id'] },
            ],
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        res.status(200).json({
            success: true,
            post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const deletePostController = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        if (post.user_id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this post',
            });
        }

        await post.destroy();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
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
            where: { shared_post_id: { [Op.ne]: null } },
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

const savePostController = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const existingSave = await SavedPost.findOne({
            where: { user_id: userId, post_id: postId },
        });

        if (existingSave) {
            return res.status(400).json({
                success: false,
                message: 'Post already saved',
            });
        }

        const savedEntry = await SavedPost.create({
            user_id: userId,
            post_id: postId,
        });

        res.status(201).json({
            success: true,
            message: 'Post bookmarked/saved successfully',
            savedEntry,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const unsavePostController = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const savedEntry = await SavedPost.findOne({
            where: { user_id: userId, post_id: postId },
        });

        if (!savedEntry) {
            return res.status(404).json({
                success: false,
                message: 'Saved post entry not found',
            });
        }

        await savedEntry.destroy();

        res.status(200).json({
            success: true,
            message: 'Post removed from saved items',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const getAllSavedPostsController = async (req, res) => {
    try {
        const userId = req.user.id;

        const savedPosts = await SavedPost.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Post,
                    as: 'post',
                    include: [
                        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'profile_picture', 'headline'] },
                        { model: Like, as: 'likesList', attributes: ['user_id'] },
                        { model: Comment, as: 'commentsList', attributes: ['id', 'content', 'user_id'] },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all saved posts successfully',
            savedPosts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

module.exports = {
    createPostController,
    getAllPostController,
    getPostByIdController,
    deletePostController,
    postSharingController,
    getAllSharedPostController,
    savePostController,
    unsavePostController,
    getAllSavedPostsController,
};
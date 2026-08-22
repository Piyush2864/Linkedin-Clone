const { Comment, Post, User } = require('../models');
const { sendNotification } = require('../utils/notification.js');

const createCommentController = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const postId = req.params.postId;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const comment = await Comment.create({
            content,
            post_id: postId,
            user_id: userId,
        });

        post.comments += 1;
        await post.save();

        if (post.user_id !== userId) {
            sendNotification(post.user_id, userId, 'comment', `Someone commented on your post`);
        }

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const getAllCommentsController = async (req, res) => {
    try {
        const postId = req.params.postId;

        const comments = await Comment.findAll({
            where: { post_id: postId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'profile_picture'] },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all comments successfully',
            comments,
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
    createCommentController,
    getAllCommentsController,
};
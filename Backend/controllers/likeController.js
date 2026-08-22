const { Like, Post, User } = require('../models');
const { sendNotification } = require('../utils/notification.js');

const createLikeController = async (req, res) => {
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

        const existingLike = await Like.findOne({
            where: { post_id: postId, user_id: userId },
        });

        if (existingLike) {
            // Unlike post
            await existingLike.destroy();
            post.likes = Math.max(0, post.likes - 1);
            await post.save();

            return res.status(200).json({
                success: true,
                message: 'Post unliked successfully',
                data: post,
            });
        }

        await Like.create({
            post_id: postId,
            user_id: userId,
        });

        post.likes += 1;
        await post.save();

        if (post.user_id !== userId) {
            sendNotification(post.user_id, userId, 'like', `Someone liked your post`);
        }

        res.status(200).json({
            success: true,
            message: 'Post liked successfully',
            data: post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const getAllLikesController = async (req, res) => {
    try {
        const postId = req.params.postId;

        const likes = await Like.findAll({
            where: { post_id: postId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'profile_picture'] },
            ],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all likes successfully',
            likes,
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
    createLikeController,
    getAllLikesController,
};
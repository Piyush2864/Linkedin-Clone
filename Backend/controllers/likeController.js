const { Like, User } = require('../models');



const createLikeController = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const existingLike = await Like.findOne({
            where: { post_id: postId, user_id: userId },
        });

        if (existingLike) {
            return res.status(400).json({
                success: false,
                message: 'You already liked this post'
            });
        }

        await Like.create({
            post_id: postId,
            user_id: userId,
        });

        const post = await Post.findByPk(postId);
        post.likes_count += 1;
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Post liked successfully',
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getAllLikesController = async (req, res) => {
    try {
        const postId = req.params.postId;

        const likes = await Like.findAll({
            where: { post_id: postId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
            ],
        });

        if (likes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No likes found for this post'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Fetch all likes successfully',
            likes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    createLikeController,
    getAllLikesController
}
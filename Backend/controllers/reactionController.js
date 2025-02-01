const { Reaction } = require('../models/reaction.js');
const { Post } = require('../models/post.js');


const createReactionController = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;
        const { type } = req.body;


        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        const existingReaction = await Reaction.findOne({ where: { post_id: postId, user_id: userId } });

        if (existingReaction) {
            return res.status(400).json({
                success: false,
                message: 'You have already reacted to this post'
            });
        }


        const newReaction = await Reaction.create({ post_id: postId, user_id: userId, type });

        res.status(201).json({
            success: true,
            message: 'Reaction added successfully',
            data: newReaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const updateReactionController = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;
        const { type } = req.body;


        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }


        const existingReaction = await Reaction.findOne({ where: { post_id: postId, user_id: userId } });

        if (!existingReaction) {
            return res.status(404).json({
                success: false,
                message: 'Reaction not found'
            });
        }

        existingReaction.type = type;
        await existingReaction.save();

        res.status(200).json({
            success: true,
            message: 'Reaction updated successfully',
            data: existingReaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getAllReactionController = async (req, res) => {
    try {
        const postId = req.params.postId;

        const reactions = await Reaction.findAll({
            where: { post_id: postId },
            attributes: ['id', 'user_id', 'type'],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all reaction successfully.',
            data: reactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    createReactionController,
    updateReactionController,
    getAllReactionController,
}
const { Comment, User } = require('../models/post.js');



const createCommentController = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const postId = req.params.postId;


        const comment = await Comment.create({
            content,
            post_id: postId,
            user_id: userId,
        });


        const post = await Post.findByPk(postId);
        post.comments_count += 1;
        await post.save();

        res.status(201).json({
            success: true,
            message: 'Comment added successfully', comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getAllCommentsController = async (req, res) => {
    try {
        const postId = req.params.postId;


        const comments = await Comment.findAll({
            where: { post_id: postId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
            ],
        });

        if (comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No comments found for this post'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Fetch all comments successfully',
            comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    createCommentController,
    getAllCommentsController
}
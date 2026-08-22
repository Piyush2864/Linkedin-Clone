const { Post } = require('../models/post.js');



const getAllPostsController = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json({
            success: true,
            message: 'Fetch all posts successfully.',
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const deletePostsController = async (req, res) => {
    try {
        const postId = req.params.postId;

        const admin = await User.findByPk(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can delete posts'
            });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        await post.destroy();
        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const searchPostsController = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const posts = await Post.findAll({
            where: {
                [Op.or]: [
                    { content: { [Op.like]: `%${query}%` } },
                ],
            },
            include: [{ model: User, attributes: ['id', 'name'] }],
        });

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    getAllPostsController,
    deletePostsController,
    searchPostsController,
}      
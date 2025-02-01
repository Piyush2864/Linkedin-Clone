const { Post, Like, Comment, User } = require('../models/post.js');



const createPostController = async (req, res) => {
    try {
        const { content} = req.body;
        const userId = req.user.id;
        const  mediaurl  = req.file ? `/uploads/${req.file.filename}` : null; 

        const post = await Post.create({
            content,
            media_url: mediaurl,
            user_id: userId,
        });

        res.status(201).json({
            success: true,
            message: 'Post created successfully', post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getAllPostController = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Like, attributes: ['user_id'] },
                { model: Comment, attributes: ['content', 'user_id'] },
            ],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all post successfully',
            posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}

module.exports ={
    createPostController,
    getAllPostController
}
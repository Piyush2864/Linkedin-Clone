const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { getAllPostsController, deletePostsController } = require('../controllers/postAdminController.js');


const router = express.Router();

router.route('/get-all-post').get(authenticationMiddleware(), getAllPostsController);

router.route('/delete-post/:postId').delete(authenticationMiddleware(), deletePostsController);

module.exports = router; 
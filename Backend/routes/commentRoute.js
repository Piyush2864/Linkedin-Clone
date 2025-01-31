const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createCommentController, getAllCommentsController } = require('../controllers/commentController.js');

const router = express.Router();


router.route('/write-comment/postId').post(authenticationMiddleware(), createCommentController);

router.route('/get-all-comments/postId').get(authenticationMiddleware(), getAllCommentsController);

module.exports = router;
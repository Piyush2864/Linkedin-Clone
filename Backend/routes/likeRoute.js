const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createLikeController, getAllLikesController } = require('../controllers/likeController.js');

const router = express.Router();


router.route('/like-post/:postId').post(authenticationMiddleware(), createLikeController);

router.route('/all-likes-post/postId').get(authenticationMiddleware(), getAllLikesController);

module.exports = router;
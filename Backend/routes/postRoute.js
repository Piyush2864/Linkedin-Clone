const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createPostController, getAllPostController, postSharingController, getAllSharedPostController } = require('../controllers/postController.js');

const router = express.Router();


router.route('/create-post').post(authenticationMiddleware(), createPostController);

router.route('/get-all-post').get(authenticationMiddleware(), getAllPostController);

router.route('/share/:postId').post(authenticationMiddleware(), postSharingController);

router.route('/get-all-share-post').get(authenticationMiddleware(), getAllSharedPostController);

module.exports = router;
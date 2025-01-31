const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createPostController, getAllPostController } = require('../controllers/postController.js');

const router = express.Router();


router.route('/create-post').post(authenticationMiddleware(), createPostController);

router.route('/get-all-post').get(authenticationMiddleware(), getAllPostController);

module.exports = router;
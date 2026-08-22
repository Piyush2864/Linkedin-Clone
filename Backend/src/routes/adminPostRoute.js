const express = require('express');
const { authenticationMiddleware } = require('../../middleware/authMiddleware.js');
const { adminMiddleware } = require('../../middleware/adminMiddleware.js');
const { getAllPostsController, deletePostsController, searchPostsController } = require('../controllers/postAdminController.js');

const router = express.Router();

router.use(authenticationMiddleware());
router.use(adminMiddleware);

router.route('/get-all-post').get(getAllPostsController);
router.route('/delete-post/:postId').delete(deletePostsController);
router.route('/search-posts').get(searchPostsController);

module.exports = router;
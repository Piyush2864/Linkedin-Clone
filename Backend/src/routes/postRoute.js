const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { upload } = require('../middleware/multerMiddleware.js');
const {
  createPostController,
  getAllPostController,
  getPostByIdController,
  deletePostController,
  postSharingController,
  getAllSharedPostController,
  savePostController,
  unsavePostController,
  getAllSavedPostsController,
} = require('../controllers/postController.js');

const router = express.Router();

router.use(authenticationMiddleware());

router.route('/create-post').post(upload.single('media'), createPostController);
router.route('/get-all-post').get(getAllPostController);
router.route('/get-post/:postId').get(getPostByIdController);
router.route('/delete-post/:postId').delete(deletePostController);
router.route('/share/:postId').post(postSharingController);
router.route('/get-all-share-post').get(getAllSharedPostController);

// Saved / Bookmarking endpoints
router.route('/save/:postId').post(savePostController);
router.route('/unsave/:postId').delete(unsavePostController);
router.route('/saved-posts').get(getAllSavedPostsController);

module.exports = router;
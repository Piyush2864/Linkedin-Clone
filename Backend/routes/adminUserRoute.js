const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { adminMiddleware } = require('../middleware/adminMiddleware.js');
const { getAllUsersController, deleteUsersController, searchUsersController } = require('../controllers/userAdminController.js');

const router = express.Router();

router.use(authenticationMiddleware());
router.use(adminMiddleware);

router.route('/get-all-user').get(getAllUsersController);
router.route('/delete-user/:userId').delete(deleteUsersController);
router.route('/search-users').get(searchUsersController);

module.exports = router;
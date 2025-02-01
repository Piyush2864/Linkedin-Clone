const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { getAllUsersController, deleteUsersController } = require('../controllers/userAdminController.js');


const router = express.Router();

router.route('/get-all-user').get(authenticationMiddleware(), getAllUsersController);

router.route('/delete-user/:userId').delete(authenticationMiddleware(), deleteUsersController);

module.exports = router;
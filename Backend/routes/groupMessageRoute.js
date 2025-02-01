const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { sendMessageInGroupController, getAllMessageFromGroupController } = require('../controllers/groupMessageController.js');


const router = express.Router();

router.route('/send-message/:groupId').post(authenticationMiddleware(), sendMessageInGroupController);

router.route('/get-all-message/:groupId').get(authenticationMiddleware(), getAllMessageFromGroupController);

module.exports = router;
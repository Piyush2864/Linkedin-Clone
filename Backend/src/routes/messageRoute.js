const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { sendMessageController, getChatHistoryController, markAsReadController } = require('../controllers/messageController.js');

const router = express.Router();

router.route('/send-message').post(authenticationMiddleware(), sendMessageController),

router.route('/get-history/:userId').get(authenticationMiddleware(), getChatHistoryController);

router.route('/mark-read/:userId').put(authenticationMiddleware(), markAsReadController);


module.exports = router;
const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createReactionController, updateReactionController, getAllReactionController } = require('../controllers/reactionController.js');


const router = express.Router();

router.route('/add-reaction/postId').post(authenticationMiddleware(), createReactionController);

router.route('/update-reaction').put(authenticationMiddleware(), updateReactionController);

router.route('/get-all-reaction').get(authenticationMiddleware(), getAllReactionController);

module.exports = router;
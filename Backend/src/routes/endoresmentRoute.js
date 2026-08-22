const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createEndoresmentController, getAllEndoresmentController } = require('../controllers/endoresmentController.js');


const router = express.Router();

router.route('/endorse-skill').post(authenticationMiddleware(), createEndoresmentController);

router.route('/get-all-endoresment/:userId').get(authenticationMiddleware(), getAllEndoresmentController);

module.exports = router;
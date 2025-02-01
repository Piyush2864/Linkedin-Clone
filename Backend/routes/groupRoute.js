const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createNewGroupController, getAllGroupController } = require('../controllers/groupController.js');


const router = express.Router();

router.route('/create-group').post(authenticationMiddleware(), createNewGroupController);

router.route('/get-all-group').get(authenticationMiddleware(), getAllGroupController);


module.exports = router;

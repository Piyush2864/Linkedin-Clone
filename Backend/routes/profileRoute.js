const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const {createProfileController, getProfileController, updateProfileController, deleteProfileController} = require('../controllers/profileController.js');
const router = express.Router();

router.route('/create-profile').post(authenticationMiddleware(), createProfileController);

router.route('/get-profile').get(authenticationMiddleware(), getProfileController);

router.route('/update-profile').put(authenticationMiddleware(), updateProfileController),

router.route('/delete-profile/:userId').delete(authenticationMiddleware(), deleteProfileController);

module.exports = router;
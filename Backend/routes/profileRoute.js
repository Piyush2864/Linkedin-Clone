const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { upload } = require('../middleware/multerMiddleware.js');
const {createProfileController, getProfileController, updateProfileController, deleteProfileController, addEndorsementController, removeEndorsementController} = require('../controllers/profileController.js');
const router = express.Router();

router.route('/create-profile').post(authenticationMiddleware(), createProfileController);

router.route('/get-profile').get(authenticationMiddleware(), getProfileController);

router.route('/update-profile').put(authenticationMiddleware(), upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]), updateProfileController),

router.route('/delete-profile/:userId').delete(authenticationMiddleware(), deleteProfileController);

router.route('/endorse').delete(authenticationMiddleware(), addEndorsementController);

router.route('/remove-endorse').delete(authenticationMiddleware(), removeEndorsementController);

module.exports = router;
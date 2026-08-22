const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { upload } = require('../middleware/multerMiddleware.js');
const {createProfileController, getProfileController, updateProfileController, deleteProfileController, addEndorsementController, removeEndorsementController} = require('../controllers/profileController.js');
const { trackProfileViewController, getAllProfileViewController, profileViewAnalyticsController } = require('../controllers/profileViewController.js');
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

router.route('/track-view/:userId').post(authenticationMiddleware(), trackProfileViewController);

router.route('/get-all-views').get(authenticationMiddleware(), getAllProfileViewController);

router.route('/get-analytics').get(authenticationMiddleware(), profileViewAnalyticsController);

module.exports = router;
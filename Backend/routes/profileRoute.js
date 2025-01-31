const express = require('express');
const autheenticationMiddleware = require('../middleware/auth');
const {createProfileController, getProfileController, updateProfileController, deleteProfileController} = require('../controllers/profileController')
const router = express.Router();

router.route('/create-profile').post(autheenticationMiddleware(), createProfileController);

router.route('/get-profile').get(autheenticationMiddleware(), getProfileController);

router.route('/update-profile').put(autheenticationMiddleware(), updateProfileController),

router.route('/delete-profile/:userId').delete(autheenticationMiddleware(), deleteProfileController);
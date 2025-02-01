const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { trackProfileViewController, getAllProfileViewController } = require('../controllers/profileViewController.js');


const router = express.Router();

router.route('/track-view/:userId').post(authenticationMiddleware(), trackProfileViewController);

router.route('/get-all-views').get(authenticationMiddleware(), getAllProfileViewController);

module.exports = router;
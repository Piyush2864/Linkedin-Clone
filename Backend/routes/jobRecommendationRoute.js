const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { recommenedJobController } = require('../controllers/jobRecommendationController.js');


const router = express.Router();

router.route('/get-recommended-jobs').get(authenticationMiddleware(), recommenedJobController);

module.exports = router;
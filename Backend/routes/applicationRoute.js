const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { applyForJobController, getAllApplicationController, updateApplicationStatusController } = require('../controllers/applicationController.js');
const router = express.Router();

router.route('/apply-job/:jobId').post(authenticationMiddleware(), applyForJobController);

router.route('/get-job/:jobId').get(authenticationMiddleware(), getAllApplicationController);

router.route('/update-job-status/:applicationId').put(authenticationMiddleware(), updateApplicationStatusController);

module.exports = router;

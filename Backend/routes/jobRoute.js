const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { createJobController, getAllJobsController } = require('../controllers/jobController.js');
const router = express.Router();

router.route('/create-job').post(authenticationMiddleware(), createJobController);

router.route('/get-all-job').get(authenticationMiddleware(), getAllJobsController);

module.exports = router;
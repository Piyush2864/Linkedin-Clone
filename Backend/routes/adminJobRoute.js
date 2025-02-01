const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { getAllJobsController, approveJobPostController, rejectJobPostController, deleteJobPostController, searchJobController } = require('../controllers/jobAdminController.js');


const router = express.Router();

router.route('/get-all-job-post').get(authenticationMiddleware(), getAllJobsController);

router.route('/approve/:jobId').put(authenticationMiddleware(), approveJobPostController);

router.route('/reject/:jobId').put(authenticationMiddleware(), rejectJobPostController);

router.route('/delete-job-post/:jobId').delete(authenticationMiddleware(), deleteJobPostController);

router.route('/search-jobs').get(authenticationMiddleware(), searchJobController);

module.exports = router; 
const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { adminMiddleware } = require('../middleware/adminMiddleware.js');
const { getAllJobsController, approveJobPostController, rejectJobPostController, deleteJobPostController, searchJobController } = require('../controllers/jobAdminController.js');

const router = express.Router();

router.use(authenticationMiddleware());
router.use(adminMiddleware);

router.route('/get-all-job-post').get(getAllJobsController);
router.route('/approve/:jobId').put(approveJobPostController);
router.route('/reject/:jobId').put(rejectJobPostController);
router.route('/delete-job-post/:jobId').delete(deleteJobPostController);
router.route('/search-jobs').get(searchJobController);

module.exports = router;
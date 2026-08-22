const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const {
  createJobController,
  getAllJobsController,
  getJobByIdController,
  deleteJobController,
} = require('../controllers/jobController.js');

const router = express.Router();

router.use(authenticationMiddleware());

router.route('/create-job').post(createJobController);
router.route('/get-all-job').get(getAllJobsController);
router.route('/get-job/:jobId').get(getJobByIdController);
router.route('/delete-job/:jobId').delete(deleteJobController);

module.exports = router;
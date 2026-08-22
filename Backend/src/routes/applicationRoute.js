const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { upload } = require('../middleware/multerMiddleware.js');
const {
  applyForJobController,
  getAllApplicationController,
  getMyApplicationsController,
  updateApplicationStatusController,
} = require('../controllers/applicationController.js');

const router = express.Router();

router.use(authenticationMiddleware());

router.route('/apply-job/:jobId').post(upload.single('resume'), applyForJobController);
router.route('/get-job-applications/:jobId').get(getAllApplicationController);
router.route('/my-applications').get(getMyApplicationsController);
router.route('/update-job-status/:applicationId').put(updateApplicationStatusController);

module.exports = router;

const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { upload } = require('../middleware/multerMiddleware.js');
const {
  createCompanyController,
  getAllCompaniesController,
  getCompanyByIdController,
  updateCompanyController,
  followCompanyController,
  unfollowCompanyController,
  getCompanyJobsController,
} = require('../controllers/companyController.js');

const router = express.Router();

router.use(authenticationMiddleware());

router.route('/create-company').post(
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 },
  ]),
  createCompanyController
);

router.route('/get-all-companies').get(getAllCompaniesController);
router.route('/get-company/:companyId').get(getCompanyByIdController);
router.route('/update-company/:companyId').put(
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 },
  ]),
  updateCompanyController
);
router.route('/follow/:companyId').post(followCompanyController);
router.route('/unfollow/:companyId').delete(unfollowCompanyController);
router.route('/jobs/:companyId').get(getCompanyJobsController);

module.exports = router;

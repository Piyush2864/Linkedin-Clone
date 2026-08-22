const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { adminMiddleware } = require('../middleware/adminMiddleware.js');
const { dashboardController } = require('../controllers/admindashboardController.js');

const router = express.Router();

router.use(authenticationMiddleware());
router.use(adminMiddleware);

router.route('/admin-dashboard-stats').get(dashboardController);

module.exports = router;
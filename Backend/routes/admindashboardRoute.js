const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { dashboardController } = require('../controllers/admindashboardController.js');


const router = express.Router();

router.route('/admin-dashboard-stats').get(authenticationMiddleware(), dashboardController);

module.exports = router; 
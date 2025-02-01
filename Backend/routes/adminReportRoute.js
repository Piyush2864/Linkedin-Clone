const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { generateCsvReportController, generatePdfReportController } = require('../controllers/adminReportController.js');


const router = express.Router();

router.route('/export/users').get(authenticationMiddleware(), generateCsvReportController);

router.route('/export/jobs').get(authenticationMiddleware(), generatePdfReportController);

module.exports = router; 
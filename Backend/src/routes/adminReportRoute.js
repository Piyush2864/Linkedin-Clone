const express = require('express');
const { authenticationMiddleware } = require('../middleware/authMiddleware.js');
const { adminMiddleware } = require('../middleware/adminMiddleware.js');
const { generateCsvReportController, generatePdfReportController } = require('../controllers/adminReportController.js');

const router = express.Router();

router.use(authenticationMiddleware());
router.use(adminMiddleware);

router.route('/export/users').get(generateCsvReportController);
router.route('/export/jobs').get(generatePdfReportController);

module.exports = router;
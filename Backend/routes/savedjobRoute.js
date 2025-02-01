const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { savedJobController, getAllSavedJobController, removeSavedJobController } = require('../controllers/savedJobController.js');


const router = express.Router();

router.route('/save-job/:jobId').post(authenticationMiddleware(), savedJobController);

router.route('/get-all-saved-job').get(authenticationMiddleware(), getAllSavedJobController);

router.route('/delete-job/:jobId').delete(authenticationMiddleware(), removeSavedJobController);

module.exports = router;
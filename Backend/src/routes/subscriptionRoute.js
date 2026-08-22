const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { upgradeToPremiumController, getSubscriptionStatusController } = require('../controllers/subscriptionController.js');


const router = express.Router();

router.route('/upgrade').put(authenticationMiddleware(), upgradeToPremiumController);

router.route('/status').get(authenticationMiddleware(), getSubscriptionStatusController);

module.exports = router;
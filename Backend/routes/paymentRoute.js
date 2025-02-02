const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createStripeSessionController, paymentConfirmationController } = require('../controllers/paymentController.js');


const router = express.Router();

router.route('/create-checkout-session').post(authenticationMiddleware(), createStripeSessionController);

router.route('/webhook').post(authenticationMiddleware(), paymentConfirmationController);

module.exports = router;
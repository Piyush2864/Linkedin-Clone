const express = require('express');
const {
  loginController,
  signupController,
  forgotPasswordController,
  resetPasswordController,
} = require('../controllers/userController.js');

const router = express.Router();

router.route('/signup').post(signupController);
router.route('/login').post(loginController);
router.route('/forgot-password').post(forgotPasswordController);
router.route('/reset-password').post(resetPasswordController);

module.exports = router;

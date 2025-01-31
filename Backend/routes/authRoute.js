const express = require('express');
const { loginController, signupController } = require('../controllers/userController.js');

const router = express.Router();

router.route('/signup').post(signupController);
router.route('/login').post(loginController);

module.exports = router;

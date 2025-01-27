import express from 'express';
import { loginController, signupController } from '../controllers/userController.js';


const router = express.Router();


router.route('/signup').post(signupController);
router.route('/login').post(loginController);
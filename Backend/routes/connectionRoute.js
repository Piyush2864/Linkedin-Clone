const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest, getAllAcceptedConnections } = require('../controllers/connectionController.js');
const router = express.Router();


router.route('/send-request').post(authenticationMiddleware(), sendConnectionRequest);

router.route('/accept-request').put(authenticationMiddleware(), acceptConnectionRequest);

router.route('/reject-request/:id').put(authenticationMiddleware(), rejectConnectionRequest);

router.route('/get-connections').get(authenticationMiddleware(), getAllAcceptedConnections);
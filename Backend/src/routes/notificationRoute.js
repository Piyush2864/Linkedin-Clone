const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createNotification, getAllNotification, markNotificationAsRead } = require('../utils/notification.js');
const { getNotifications } = require('../controllers/notificationController.js');
const router = express.Router();

router.route('/create-notification').post(authenticationMiddleware(), createNotification);

router.route('/get-all-notification').get(authenticationMiddleware(), getAllNotification);

router.route('/mark-read-notification/:id').put(authenticationMiddleware(), markNotificationAsRead);

router.route('/mark-read-notification/:id').get(authenticationMiddleware(), getNotifications);

module.exports = router;
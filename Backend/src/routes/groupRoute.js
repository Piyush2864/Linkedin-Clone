const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const { createNewGroupController, getAllGroupController, userAddedByAdminController, removeUserByAdminController, changeUserToAdminController } = require('../controllers/groupController.js');


const router = express.Router();

router.route('/create-group').post(authenticationMiddleware(), createNewGroupController);

router.route('/get-all-group').get(authenticationMiddleware(), getAllGroupController);

router.route('/add-member/groupId').post(authenticationMiddleware(), userAddedByAdminController);

router.route('/:groupId/remove-member/:userId').delete(authenticationMiddleware(), removeUserByAdminController);

router.route('/:groupId/promote/:userId').put(authenticationMiddleware(), changeUserToAdminController);

module.exports = router;

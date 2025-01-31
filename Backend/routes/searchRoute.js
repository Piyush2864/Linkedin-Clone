const express = require('express');
const {authenticationMiddleware} = require('../middleware/authMiddleware.js');
const {searchPostController, advacedsearchController, autoCompleteController} = require('../controllers/searchController.js');

const router = express.Router();

router.route('/search').get(authenticationMiddleware(), searchPostController);

router.route('/advanced-search').get(authenticationMiddleware(),advacedsearchController);

router.route('/autocomplete').get(authenticationMiddleware(), autoCompleteController);

module.exports = router;
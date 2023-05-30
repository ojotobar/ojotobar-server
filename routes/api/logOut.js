const express = require('express');
const router = express.Router();
const logOutController = require('../../controllers/logOutController');

router.get('/', logOutController.handleLogOut)

module.exports = router;
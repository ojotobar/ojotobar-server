const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

router.patch('/', authController.handleVerifyEmail)

module.exports = router;
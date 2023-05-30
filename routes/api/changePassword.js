const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/:userId')
    .patch(verifyJWT, authController.handleChangePassword);

router.route('/forgotten')
    .patch(authController.handleChangeForgottenPassword);

module.exports = router;
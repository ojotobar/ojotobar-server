const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.route('/:userId')
    .post(userController.notify);
 
module.exports = router;
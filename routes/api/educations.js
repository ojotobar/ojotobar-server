const express = require('express');
const router = express.Router();
const ROLES = require('../../config/roles_list');
const educationController = require('../../controllers/educationsController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(educationController.get)
    .post(verifyJWT, verifyRoles(ROLES.Admin), educationController.create);

router.route('/:userId')
    .get(educationController.getByUserId);

router.route('/single/:id')
    .get(educationController.getById);

router.route('/:id')
    .put(verifyJWT, verifyRoles(ROLES.Admin), educationController.update)
    .delete(verifyJWT, verifyRoles(ROLES.Admin), educationController.remove);

module.exports = router;
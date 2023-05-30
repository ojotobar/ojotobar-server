const express = require('express');
const router = express.Router();
const ROLES = require('../../config/roles_list');
const addressController = require('../../controllers/addressController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(addressController.get)
    .post(verifyJWT, verifyRoles(ROLES.Admin), addressController.create);

router.route('/:userId')
    .get(addressController.getByRouteUserId);

router.route('/single/:id')
    .get(addressController.getById)

router.route('/:id')
    .put(verifyJWT, verifyRoles(ROLES.Admin), addressController.update)
    .delete(verifyJWT, verifyRoles(ROLES.Admin), addressController.remove);

module.exports = router;
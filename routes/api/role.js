const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/roleController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES = require('../../config/roles_list');

router.route('/')
    .post(verifyJWT, verifyRoles(ROLES.Admin), roleController.create)
    .get(verifyJWT, verifyRoles(ROLES.Admin), roleController.getAll);

router.route('/:id')
    .get(verifyJWT, verifyRoles(ROLES.Admin), roleController.getById)
    .put(verifyJWT, verifyRoles(ROLES.Admin), roleController.update)
    .delete(verifyJWT, verifyRoles(ROLES.Admin), roleController.remove);

module.exports = router;
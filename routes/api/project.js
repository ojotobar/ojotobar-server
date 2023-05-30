const express = require('express');
const router = express.Router();
const ROLES = require('../../config/roles_list');
const projectController = require('../../controllers/projectController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(projectController.get)
    .post(verifyJWT, verifyRoles(ROLES.Admin), projectController.create);

router.route('/:userId')
    .get(projectController.getByRouteUserId);

router.route('/single/:id')
    .get(projectController.getById);

router.route('/:id')
    .put(verifyJWT, verifyRoles(ROLES.Admin), projectController.update)
    .delete(verifyJWT, verifyRoles(ROLES.Admin), projectController.remove);

module.exports = router;
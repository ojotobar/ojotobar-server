const express = require('express');
const router = express.Router();
const ROLES = require('../../config/roles_list');
const experienceController = require('../../controllers/experienceController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(experienceController.get)
    .post(verifyJWT, verifyRoles(ROLES.Admin), experienceController.create);

router.route('/:userId')
    .get(experienceController.getByRouteUserId);
    
router.route('/single/:id')
    .get(experienceController.getById);

router.route('/:id')
    .put(verifyJWT, verifyRoles(ROLES.Admin), experienceController.update)
    .delete(verifyJWT, verifyRoles(ROLES.Admin), experienceController.remove);

module.exports = router;
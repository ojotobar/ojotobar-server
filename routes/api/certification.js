const express = require('express');
const router = express.Router();
const ROLES = require('../../config/roles_list');
const certificationController = require('../../controllers/certificationController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(certificationController.get)
    .post(verifyJWT, verifyRoles(ROLES.Admin), certificationController.create);

router.route('/single/:id')
    .get(certificationController.getById);
    
router.route('/:userId')
    .get(certificationController.getByRouteUserId);

router.route('/:id')
    .put(verifyJWT, verifyRoles(ROLES.Admin), certificationController.update)
    .delete(verifyJWT, verifyRoles(ROLES.Admin), certificationController.remove);

module.exports = router;
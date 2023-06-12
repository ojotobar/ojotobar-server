const express = require('express');
const router = express.Router();
const ROLES = require('../../config/roles_list');
const socialLinkController = require('../../controllers/socialLinkController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const verifySocialMediaName = require('../../middleware/verifySocialMedia');
const SM_NAMES = require('../../config/allowedSocialName');

router.route('/')
    .get(socialLinkController.get)
    .post(verifyJWT, verifyRoles(ROLES.Admin), verifySocialMediaName(SM_NAMES.Github, SM_NAMES.LinkedIn, SM_NAMES.Website, SM_NAMES.WhatsApp), socialLinkController.create);

router.route('/:userId')
    .get(socialLinkController.getByRouteUserId);

router.route('/single/:id')
    .get(socialLinkController.getById)

router.route('/:id')
    .put(verifyJWT, verifyRoles(ROLES.Admin), verifySocialMediaName(SM_NAMES.Github, SM_NAMES.LinkedIn, SM_NAMES.Website, SM_NAMES.WhatsApp, SM_NAMES.Facebook), socialLinkController.update)
    .delete(verifyJWT, verifyRoles(ROLES.Admin), socialLinkController.remove);

module.exports = router;
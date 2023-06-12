const express = require('express');
const router = express.Router();
const ROLES = require('../../config/roles_list');
const skillController = require('../../controllers/skillController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const verifySkillLevels = require('../../middleware/verifySkillLevels');
const SKILL_LEVELS = require('../../config/allowedSkillLevels');
const fileController = require('../../controllers/fileController');
const multer = require('multer');
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else{
        cb("Invalid image file", false);
    }
};
const upload = multer({ storage, fileFilter });

router.route('/')
    .get(skillController.get)
    .post(verifyJWT, 
        verifySkillLevels(SKILL_LEVELS.Advanced, SKILL_LEVELS.Beginner, SKILL_LEVELS.Expert, SKILL_LEVELS.Proficient, SKILL_LEVELS.Novice), 
        verifyRoles(ROLES.Admin), skillController.create);

router.route('/:userId')
    .get(skillController.getByRouteUserId);

router.route('/single/:id')
    .get(skillController.getById);

router.route('/:id')
    .put(verifyJWT,
        verifySkillLevels(SKILL_LEVELS.Advanced, SKILL_LEVELS.Beginner, SKILL_LEVELS.Expert, SKILL_LEVELS.Proficient, SKILL_LEVELS.Novice),
        verifyRoles(ROLES.Admin), skillController.update)
    .delete(verifyJWT, verifyRoles(ROLES.Admin), skillController.remove);

router.route('/:id/upload-icon')
    .post(verifyJWT,verifyRoles(ROLES.Admin), upload.single('icon'), fileController.uploadSkillIcon);

module.exports = router;
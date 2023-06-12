const express = require('express');
const router = express.Router();
const ROLES = require('../../config/roles_list');
const projectController = require('../../controllers/projectController');
const fileController = require('../../controllers/fileController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
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
    .get(projectController.get)
    .post(verifyJWT, verifyRoles(ROLES.Admin), projectController.create);

router.route('/:userId')
    .get(projectController.getByRouteUserId);

router.route('/single/:id')
    .get(projectController.getById);

router.route('/:id')
    .put(verifyJWT, verifyRoles(ROLES.Admin), projectController.update)
    .delete(verifyJWT, verifyRoles(ROLES.Admin), projectController.remove);

router.route('/:id/upload-page-image')
    .post(verifyJWT, upload.single('page-image'), fileController.uploadProjectPage)

module.exports = router;
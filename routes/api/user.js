const express = require('express');
const router = express.Router();
const fileController = require('../../controllers/fileController');
const verifyJWT = require('../../middleware/verifyJWT');
const multer = require('multer');
const storage = multer.diskStorage({});
const userController = require('../../controllers/userController');

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else{
        cb("Invalid image file", false);
    }
};
const upload = multer({ storage, fileFilter });

router.route('/')
    .get(userController.getSingleUser);

router.route('/:userId')
    .post(userController.notify);

router.route('/biography/:userId')
    .post(verifyJWT, userController.createBiography)
    .get(userController.getBiography)
    .put(verifyJWT, userController.updateBiography);

router.route('/biography/:id')
    .delete(verifyJWT, userController.removeBiography);

router.route('/stats/:userId')
    .get(userController.stats);

router.route('/upload-photo/:userId')
    .post(verifyJWT, upload.single('image'), fileController.uploadUserPhoto);

router.route('/:id/info')
    .get(userController.getPersonalInfo);

module.exports = router;
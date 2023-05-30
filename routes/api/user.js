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
    
router.route('/upload-photo/:userId')
    .post(verifyJWT, upload.single('image'), fileController.uploadUserPhoto);

module.exports = router;
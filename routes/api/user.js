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

// /**
//  * @swagger
//  * components:
//  *  securitySchemes:
//  *      BearerAuth:
//  *          type: http
//  *          scheme: bearer
//  */

/**
 * @swagger
 * components:
 *  schemas:
 *      genRes:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      user:
 *          type:
 *          properties:
 *              id:
 *                  type: string
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 *              middleName:
 *                  type: string
 *              emailAddress:
 *                  type: string
 *              phoneNumber:
 *                  type: string
 *              dateOfBirth:
 *                  type: string
 *              photoUrl:
 *                  type: string
 */

// /**
//  * @swagger
//  * /user:
//  *  get:
//  *      summary: Return the user details
//  *      tags: [User]
//  *          content:
//  *              application/json:
//  *      responses:
//  *          200:
//  *              description: User profile details
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          $ref: '#/components/schemas/user'
//  */
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
    
/**
 * @swagger
 * /user/upload-photo/{userId}:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Uploads user profile photo
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: The user id
 * 
 *          - in: formData
 *            name: image
 *            schema:
 *              type: file
 *            required: true
 *            description: Profile Image
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/genRes'
 *          404:
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/genRes'
 *          500:
 *              description: Server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/genRes'
 */
router.route('/upload-photo/:userId')
    .post(verifyJWT, upload.single('image'), fileController.uploadUserPhoto);

router.route('/:id/info')
    .get(userController.getPersonalInfo);

module.exports = router;
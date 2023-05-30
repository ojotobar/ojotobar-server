const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

const uploadUserPhoto = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findOne({ _id: userId });
        if(!user) return res.status(404).json({'message':`No user found with Id: ${userId}`});

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "portfolio",
            public_id: `${user?._id}_profile`,
            width: 400,
            height: 400,
            crop: "scale"
        });
        user.photoUrl = result.secure_url;
        user.publicId = result.public_id;
        //save changes
        await user.save();
        res.status(200).json({'message':'Profile photo successfully uploaded.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

module.exports = {
    uploadUserPhoto
}
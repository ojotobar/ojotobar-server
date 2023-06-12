const User = require('../models/User');
const Skill = require('../models/Skill');
const cloudinary = require('../utils/cloudinary');
const Project = require('../models/Project');

const uploadUserPhoto = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findOne({ _id: userId });
        if(!user) return res.status(404).json({'message':`No user found with Id: ${userId}`});

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "portfolio",
            public_id: `${user?._id}_profile`,
            width: 700,
            height: 700,
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

const uploadProjectPage = async (req, res) => {
    const id = req.params.id;
    try {
        const proj = await Project.findOne({ _id: id });
        if(!proj) return res.status(404).json({'message':`No project found with Id: ${id}`});

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "project",
            public_id: `${proj?._id}_project`
        });
        proj.pageUrl = result.secure_url;
        proj.pageUrlPublicId = result.public_id;
        //save changes
        await proj.save();
        res.status(200).json({'message':'Project page image successfully uploaded.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const uploadSkillIcon = async (req, res) => {
    const id = req.params.id;
    try {
        const skill = await Skill.findOne({ _id: id });
        if(!skill) return res.status(404).json({'message':`No Skill found with Id: ${id}`});

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "SkillIcon",
            public_id: `${skill?._id}_icon`,
            width: 700,
            height: 700,
            crop: "scale"
        });

        skill.iconUrl = result.secure_url;
        skill.publicId = result.public_id;
        //save changes
        await skill.save();
        res.status(200).json({'message':'Skill icon successfully uploaded.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

module.exports = {
    uploadUserPhoto,
    uploadSkillIcon,
    uploadProjectPage
}
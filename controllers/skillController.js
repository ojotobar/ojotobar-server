const Skill = require('../models/Skill');
const User = require('../models/User');

const create = async (req, res) => {
    const refreshToken = req.cookies?.jwt;
    const {
        skill,
        level
    } = req.body;

    if(!skill || !level)
        return res.status(400).json({'message':'Please fill in all the required fields'});

    try {
        const user = await User.findOne({ refreshToken: refreshToken }).exec();
        if(!user) return res.status(404).json({'message':'User not found.'});

        const skillToCreate = {
            "userId": user._id,
            "skill": skill,
            "level": level
        }
        await Skill.create(skillToCreate);
        res.status(200).json({'message':'Skill record successfully added.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const get = async (req, res) => {
    try {
        const skills = await Skill.find().sort({ skill: 1 });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getByRouteUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const skills = await Skill.find({ userId: userId }).sort({ skill: 1 });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const skill = await Skill.findOne({ _id: id }).exec();
        if(!skill) return res.status(404).json({'message':`No skill record found for Id: ${id}`});
        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const update = async (req, res) => {
    var id = req.params.id;
    const {
        skill,
        level,
    } = req.body;

    if(!skill || !level)
        return res.status(400).json({'message':'Please fill in all the required fields'});
    try {
        const skillToUpdate = await Skill.findOne({ _id: id }).exec();
        if(!skill) return res.status(404).json({'message':`No skill record found for Id: ${id}`});

        skillToUpdate.skill = skill;
        skillToUpdate.level = level;
        await skillToUpdate.save();
        res.status(200).json({'message':'Skill record successfully updated.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const remove = async (req, res) => {
    const id = req.params.id;
    try {
        await Skill.findByIdAndDelete({ _id: id });
        res.status(200).json({'message':'Skill record successfully deleted.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

module.exports = {
    create,
    get,
    getById,
    getByRouteUserId,
    update,
    remove
};
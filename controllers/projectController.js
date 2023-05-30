const Project = require('../models/Project');
const User = require('../models/User');

const create = async (req, res) => {
    const refreshToken = req.cookies?.jwt;
    const {
        name,
        description,
        techStacks,
        url
    } = req.body;

    if(!name || !description || !techStacks)
        return res.status(400).json({'message':'Please fill in all the required fields'});

    try {
        const user = await User.findOne({ refreshToken: refreshToken }).exec();
        if(!user) return res.status(404).json({'message':'User not found.'});

        const project = {
            "userId": user._id,
            "name": name,
            "description": description,
            "techStacks": techStacks,
            "url": url
        }
        await Project.create(project);
        res.status(200).json({'message':'Project record successfully added.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const get = async (req, res) => {
    try {
        const proj = await Project.find().sort({ name: 1 });
        res.status(200).json(proj);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getByRouteUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const projs = await Project.find({ userId: userId }).sort({ name: 1 });
        res.status(200).json(projs);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const proj = await Project.findOne({ _id: id }).exec();
        if(!proj) return res.status(404).json({'message': `No project record with Id ${id}`});
        res.status(200).json(proj);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const update = async (req, res) => {
    var id = req.params.id;
    const {
        name,
        description,
        techStacks,
        url
    } = req.body;

    if(!name || !description || !techStacks)
        return res.status(400).json({'message':'Please fill in all the required fields'});
    try {
        const proj = await Project.findOne({ _id: id }).exec();
        if(!proj) return res.status(404).json({'message':`No project record found for Id: ${id}`});

        proj.name = name;
        proj.description = description;
        proj.techStacks = techStacks;
        proj.url = url;
        await proj.save();
        res.status(200).json({'message':'Project record successfully updated.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const remove = async (req, res) => {
    const id = req.params.id;
    try {
        await Project.findByIdAndDelete({ _id: id });
        res.status(200).json({'message':'Project record successfully deleted.'});
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
}
const SocialLink = require('../models/SocialLink');
const User = require('../models/User');

const create = async (req, res) => {
    const refreshToken = req.cookies?.jwt;
    const {
        name,
        url
    } = req.body;

    if(!name || !url)
        return res.status(400).json({'message':'Please fill in all the required fields'});

    try {
        const user = await User.findOne({ refreshToken: refreshToken }).exec();
        if(!user) return res.status(404).json({'message':'User not found.'});

        const socialLink = {
            "userId": user._id,
            "name": name,
            "url": url
        }
        await SocialLink.create(socialLink);
        res.status(200).json({'message':'Social Media Link record successfully added.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const get = async (req, res) => {
    try {
        const socialLinks = await SocialLink.find().sort({ name: 1 });
        res.status(200).json(socialLinks);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getByRouteUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const socialLinks = await SocialLink.find({ userId: userId }).sort({ name: 1 });
        res.status(200).json(socialLinks);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const smLink = await SocialLink.findOne({ _id: id }).exec();
        if(!smLink) return res.status(404).json({'message':`No social media record with Id: ${id}`});
        res.status(200).json(smLink);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const update = async (req, res) => {
    var id = req.params.id;
    const {
        name,
        url,
    } = req.body;

    if(!name || !url)
        return res.status(400).json({'message':'Please fill in all the required fields'});
    try {
        const socialLink = await SocialLink.findOne({ _id: id }).exec();
        if(!socialLink) return res.status(404).json({'message':`No Social Media Link record found for Id: ${id}`});

        socialLink.name = name;
        socialLink.url = url;

        await socialLink.save();
        res.status(200).json({'message':'Social Media Link record successfully updated.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const remove = async (req, res) => {
    const id = req.params.id;
    try {
        await SocialLink.findByIdAndDelete({ _id: id });
        res.status(200).json({'message':'Social Media Link record successfully deleted.'});
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
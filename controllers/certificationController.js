const Certification = require('../models/Certification');
const User = require('../models/User');

const create = async (req, res) => {
    const refreshToken = req.cookies?.jwt;
    const {
        name,
        issuingBody,
        issueDate,
        certUrl
    } = req.body;

    if(!name || !issuingBody || !issueDate)
        return res.status(400).json({'message':'Please fill in all the required fields'});

    try {
        const user = await User.findOne({ refreshToken: refreshToken }).exec();
        if(!user) return res.status(404).json({'message':'User not found.'});

        const cert = {
            "userId": user._id,
            "name": name,
            "issuingBody": issuingBody,
            "issueDate": issueDate,
            "certUrl": certUrl
        }
        await Certification.create(cert);
        res.status(200).json({'message':'Certification record successfully added.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const get = async (req, res) => {
    try {
        const cert = await Certification.find().sort({ issueDate: -1 });
        res.status(200).json(cert);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getByRouteUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const cert = await Certification.find({ userId: userId }).sort({ issueDate: -1 });
        res.status(200).json(cert);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const cert = await Certification.findOne({ _id: id }).exec();
        if(!cert) return res.status(404).json({'messgae':`No certification found for Id: ${id}`});
        res.status(200).json(cert);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const update = async (req, res) => {
    var id = req.params.id;
    const {
        name,
        issuingBody,
        issueDate,
        certUrl
    } = req.body;

    if(!name || !issuingBody || !issueDate)
        return res.status(400).json({'message':'Please fill in all the required fields'});
    try {
        const cert = await Certification.findOne({ _id: id }).exec();
        if(!cert) return res.status(404).json({'message':`No certification record found for Id: ${id}`});

        cert.name = name;
        cert.issuingBody = issuingBody;
        cert.issueDate = issueDate;
        cert.certUrl = certUrl;

        await cert.save();
        res.status(200).json({'message':'Certification record successfully updated.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const remove = async (req, res) => {
    const id = req.params.id;
    try {
        await Certification.findByIdAndDelete({ _id: id });
        res.status(200).json({'message':'Certification record successfully deleted.'});
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
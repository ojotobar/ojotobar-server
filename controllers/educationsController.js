const Education = require('../models/Education');
const User = require('../models/User');

const get = async (req, res) => {
    res.status(200).json(await Education.find().sort({ startDate: -1 }));
}

const getByUserId = async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId });
    if(!user) return res.status(404).json({'message':'No user found'});
    res.status(200).json(await Education.find({ userId: user._id }).sort({ startDate: -1 }));
}

const create = async (req, res) => {
    const { 
        institution, 
        qualificationObtained, 
        startDate, 
        endDate 
    } = req.body;

    if(!institution || !qualificationObtained || !startDate)
        return res.status(400).json({'message':'Please fill in all the required fields.'});
    if(new Date(startDate).getTime() > new Date().getTime()) return res.status(400).json({'message':'Start Date can not be in the future'});
    if(endDate && (new Date(endDate).getTime() < new Date(startDate).getTime()))
        return req.status(400).json({'message':'Start Date can not be later than End Date'});

    try {
        const user = await User.findOne({ refreshToken: req.cookies?.jwt });
        if(!user) return res.status(404).json({'message':'No user found'});

        const newEducation = {
            "userId": user._id,
            "institution": institution,
            "qualificationObtained": qualificationObtained,
            "startDate": new Date(startDate),
            "endDate": endDate
        }
        await Education.create(newEducation);
        res.status(200).json({'message': 'Education record successfully added.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
}

const update = async (req, res) => {
    const { 
        institution, 
        qualificationObtained, 
        startDate, 
        endDate 
    } = req.body;

    if(!institution || !qualificationObtained || !startDate)
        return res.status(400).json({'message':'Please fill in all the required fields.'});
    if(new Date(startDate).getTime() > new Date().getTime()) return res.status(400).json({'message':'Start Date can not be in the future'});
    if(endDate && (new Date(endDate).getTime() < new Date(startDate).getTime()))
        return req.status(400).json({'message':'Start Date can not be later than End Date'});

    try {
        const user = await User.findOne({ refreshToken: req.cookies?.jwt });
        if(!user) return res.status(404).json({'message':'No user found'});

        const education = await Education.findById({ _id: req.params.id });
        if(!education) 
            return res.status(404).json({'message':`No education record found for Id: ${req.params.id}`});
        if(education.userId !== user._id.toString()) return res.status(400).json({'message':'You can only update records associated with you.'}); 

        education.institution = institution;
        education.qualificationObtained = qualificationObtained;
        education.startDate = startDate;
        education.endDate = endDate;
        await education.save();
        res.status(200).json({'message':'Education record successfully updated'});
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const remove = async (req, res) => {
    const id = req.params.id;
    if(!id) return res.status(400).json({'message':`No education record found with Id: ${id}`});
    try {
        await Education.findByIdAndDelete({ _id: id });
        res.status(200).json({'message':'Education record successfully deleted.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
    
}

const getById = async (req, res) => {
    const education = await Education.findById({ _id: req.params.id });
    if(!education) 
        return res.status(404).json({'message':`No education record found for Id: ${req.params.id}`});
    res.status(200).json(education);
}

module.exports = { 
    get, 
    create, 
    update, 
    remove, 
    getById,
    getByUserId
};
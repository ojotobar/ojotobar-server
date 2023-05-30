const Experience = require('../models/Experience');
const User = require('../models/User');

const create = async (req, res) => {
    const refreshToken = req.cookies?.jwt;
    const {
        company,
        jobTitle,
        description,
        city,
        country,
        startDate,
        endDate
    } = req.body;

    if(!company || !jobTitle || !description || !city || !country || !startDate)
        return res.status(400).json({'message':'Please fill in all the required fields'});
    if(new Date(endDate).getTime() < new Date(startDate).getTime())
        return res.status(400).json({'message':'The Start Date can not be later than End Date'});
    try {
        const user = await User.findOne({ refreshToken: refreshToken }).exec();
        if(!user) return res.status(404).json({'message':'User not found.'});

        const newXp = {
            "userId": user._id,
            "company": company,
            "jobTitle": jobTitle,
            "description": description,
            "city": city,
            "country": country,
            "startDate": new Date(startDate),
            "endDate": endDate
        }
        await Experience.create(newXp);
        res.status(200).json({'message':'Experience record successfully added.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getByRouteUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const experiences = await Experience.find({ userId: userId }).sort({ startDate: -1 });
        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const experience = await Experience.findOne({ _id: id }).exec();
        if(!experience) return res.status(404).json({'message':`No experience record found with Id: ${id}`});
        res.status(200).json(experience);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const get = async (req, res) => {
    try {
        const exp = await Experience.find().sort({ startDate: -1 });
        res.status(200).json(exp);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const remove = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Experience.findByIdAndDelete({ _id: id });
        res.status(200).json({'message':'Experience record successfully deleted.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const update = async (req, res) => {
    var id = req.params.id;
    const {
        company,
        jobTitle,
        description,
        city,
        country,
        startDate,
        endDate
    } = req.body;

    if(!company || !jobTitle || !description || !city || !country || !startDate)
        return res.status(400).json({'message':'Please fill in all the required fields'});
    if(new Date(endDate).getTime() < new Date(startDate).getTime())
        return res.status(400).json({'message':'The Start Date can not be later than End Date'});
    
    try {
        const exp = await Experience.findOne({ _id: id }).exec();
        if(!exp) return res.status(404).json({'message':`No experience record found for Id: ${id}`});

        exp.company = company;
        exp.jobTitle = jobTitle;
        exp.description = description;
        exp.city = city;
        exp.country = country;
        exp.startDate = startDate;
        exp.endDate = endDate;

        await exp.save();
        res.status(200).json({'message':'Experience record successfully updated.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

module.exports = {
    create,
    get,
    getByRouteUserId,
    remove,
    update,
    getById
}
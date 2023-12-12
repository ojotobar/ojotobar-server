const User = require('../models/User');
const path = require('path');
const fsPromises = require('fs').promises;
const { sendEmail } = require('../utils/sendEmail');
const Biography = require('../models/Biography');
const { trace } = require('console');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const Address = require('../models/Address');
const { differenceInMonths, parseISO } = require('date-fns');
const UserAgent = require('../models/UserAgent');
const MONTHS_IN_A_YEAR = 12;

const createBiography = async (req, res) => {
    const userId = req.params.userId;
    const {
        biography
    } = req.body;
    
    if(!biography)
        return res.status(400).json({'message':'Biography field is required.'});
    try {
        const user = await User.findOne({ _id: userId });
        if(user){
            if((await Biography.findOne({ userId: user._id }))?.userId) 
                return res.status(400).json({'message':`Biography record already exists for User with Id: ${userId}`});
            const newBio = {
                "userId": user._id,
                "biography": biography
            }
            await Biography.create(newBio);
            res.status(200).json({'message': 'Biography successfully added.'});
        } else {
            res.status(404).json({'message': 'User Not found.'});
        }
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getBiography = async (req, res) => {
    const userId = req.params.userId;
    try {
        const biography = await Biography.findOne({ userId: userId });
        res.status(200).json(biography);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const updateBiography = async (req, res) => {
    const userId = req.params.userId;
    const {
        biography
    } = req.body;

    if(!biography) return res.status(400).json({'message':'Biogrpahy is a required field.'});
    try {
        const user = await User.findOne({ _id: userId });
        if(user){
            const biographyToUpdate = await Biography.findOne({ userId: userId });
            if(biographyToUpdate){
                biographyToUpdate.biography = biography;
                biographyToUpdate.save();

                res.status(200).json({'message':'Biography successfully updated.'});
            } else {
                res.status(404).json({'message':`No biography record found for user with Id: ${userId}`});
            }
        } else {
            res.status(404).json({'message':'User not found'});
        }
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const removeBiography = async (req, res) => {
    const id = req.params.id;
    if(!id) return res.status(400).json({'message':`No biography record found with Id: ${id}`});
    try {
        await Biography.findByIdAndDelete({ _id: id });
        res.status(200).json({'message':'Biography record successfully deleted.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getSingleUser = async (req, res) => {
    const userAgent = req.get("user-agent");
    const user = (await User.find())[0];
    const biography = await Biography.findOne({ userId: user?._id });

    if(userAgent){
        const newUserAgent = {
            "name": userAgent,
        }
        
        await UserAgent.create(newUserAgent);
    }

    res.status(200).json({
        "id": user?._id,
        "firstName": user?.firstName,
        "lastName": user?.lastName,
        "middleName": user?.middleName,
        "emailAddress": user?.emailAddress,
        "phoneNumber": user?.phoneNumber,
        "dateOfBirth": user?.dateOfBirth,
        "photoUrl": user?.photoUrl,
        "biography": biography?.biography
    });
};

const getPersonalInfo = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        const address = await Address.findOne({ userId: req.params.id });

        res.status(200).json({
            "firstName": user?.firstName,
            "lastName": user?.lastName,
            "middleInitial": user?.middleName ? `${user?.middleName[0]}.` : '',
            "phone": user?.phoneNumber,
            "email": user?.emailAddress,
            "address": address? `${address?.city}, ${address?.country} - ${address?.postalCode}` : ''
        })
    } catch (error) {
        res.status(500).json({'message':error.message});
    }


}

const notify = async (req, res) => {
    const userId = req.params.userId;
    const {
        name,
        email,
        message
    } = req.body;
    if(!name || !email || !message) return res.status(400).json({'message':'All the fields are required.'})

    try {
        const user = await User.findOne({ _id: userId });
        if(user){
            const filePath = path.join(__dirname, '..', 'views', 'Notification.html');
            //if(fs.filePath)
            let template = await fsPromises.readFile(filePath, 'utf8');
            let messageToSend = template
                            .replace("[[FIRSTNAME]]", user.firstName)
                            .replace("[[SENDERNAME]]", name)
                            .replace("[[SENTMESSAGE]]", message)
                            .replace("[[SENDEREMAIL]]", email)
                            .replace("[[YEAR]]", (new Date()).getFullYear());
            //send notification to user
            const payLoad = { 
                recipientEmail: user.emailAddress, 
                recipientName: user.firstName, 
                subject: `Message From ${name}`, 
                html: messageToSend
            };
            sendEmail(payLoad);
            res.status(200).json({'message':'Message successfully sent'});
        } else {
            res.status(404).json({'message': 'User Not found.'});
        }
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};
//--Calc yrs of xp, number of skills, number of projects worked on features on the BE
const stats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const experiences = await Experience.find({ userId: userId });
        const skills = await Skill.find({ userId: userId });
        const cert = await Certification.find({ userId: userId });

        let months = 0;
        experiences?.forEach(exp => {
            const nowDate = !exp?.endDate ? new Date() : exp?.endDate;
            months += differenceInMonths(parseISO(new Date(nowDate).toISOString()), parseISO(new Date(exp?.startDate).toISOString()))
        });
        const yearsString = Math.floor(months / MONTHS_IN_A_YEAR) > 0 ? `${Math.floor(months / MONTHS_IN_A_YEAR)} years`: `${Math.floor(months / MONTHS_IN_A_YEAR)} year`;
        const monthsString = months % MONTHS_IN_A_YEAR > 0 ? `${months % MONTHS_IN_A_YEAR} months` : `${months % MONTHS_IN_A_YEAR} month`;
        
        const xpInYears = months / MONTHS_IN_A_YEAR;
        const xpString = `${yearsString} ${monthsString}`;
        const numOfSkills = skills.length;
        const numOfProjects = 9;
        const numOfCerts = cert.length;
        
        res.status(200).json({
            "ExperienceInYears": xpInYears,
            "ExperienceString": xpString,
            "Skills": numOfSkills,
            "Projects": numOfProjects,
            "Cerifications": numOfCerts
        })
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const userAgents = async (req, res) => {
    try {
        const agents = await UserAgent.find().sort({ createdAt: -1 });;
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

module.exports = {
    getSingleUser,
    notify,
    createBiography,
    getBiography,
    updateBiography,
    removeBiography,
    stats,
    getPersonalInfo,
    userAgents
}
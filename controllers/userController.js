const User = require('../models/User');
const path = require('path');
const fsPromises = require('fs').promises;
const { sendEmail } = require('../utils/sendEmail');

const getSingleUser = async (req, res) => {
    const user = (await User.find())[0];
    res.status(200).json({
        "id": user?._id,
        "firstName": user?.firstName,
        "lastName": user?.lastName,
        "middleName": user?.middleName,
        "emailAddress": user?.emailAddress,
        "phoneNumber": user?.phoneNumber,
        "dateOfBirth": user?.dateOfBirth,
        "photoUrl": user?.photoUrl,
    });
};

const notify = async (req, res) => {
    const userId = req.params.userId;
    const {
        name,
        email,
        message
    } = req.body;

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

module.exports = {
    getSingleUser,
    notify
}
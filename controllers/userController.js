const User = require('../models/User');

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

module.exports = {
    getSingleUser
}
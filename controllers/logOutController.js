const User = require('../models/User');

const handleLogOut = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if(!foundUser){
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    //Delete the refresh token
    const currentUser = await User.findOneAndUpdate({ _id: foundUser?._id }, { refreshToken: '' });
    //Clear cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });//secure: true might not work for Thunder Client
    res.sendStatus(204);
}

module.exports = { handleLogOut };
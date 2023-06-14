const Users = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fsPromises = require('fs').promises;
const { addHours } = require('date-fns');
const path = require('path');
const { sendEmail } = require('../utils/sendEmail');
const User = require('../models/User');
const isValidPassword = require('../utils/isValidPassword');

const handleLogin = async (req, res) => {
    const { emailAddress, password } = req.body;
    if(!emailAddress || !password) return res.status(400).json({ 'message': 'Email and password are required.'});

    const foundUser = await Users.findOne({ emailAddress: emailAddress }).exec();
    if(!foundUser) return res.status(404).json({'message':`No user found with email: ${emailAddress}`});
    if(!foundUser.isEmailConfirmed) {
        const origin = req.headers.origin;
        try {
            const filePath = path.join(__dirname, '..', 'views', 'VerifyEmail.html');
            const emailToken = crypto.randomBytes(64).toString("hex");
            //if(fs.filePath)
            let template = await fsPromises.readFile(filePath, 'utf8');
            let message = template
                            .replace("[[FIRSTNAME]]", foundUser.firstName)
                            .replace("[[PERMALINK]]", `${origin}/verify-email?token=${emailToken}`)
                            .replace("[[YEAR]]", (new Date()).getFullYear());
            //send verification link to user
            const payLoad = { 
                recipientEmail: foundUser.emailAddress, 
                recipientName: foundUser.firstName, 
                subject: "Verify Your Email", 
                html: message
            };
            sendEmail(payLoad);
            //set the user token and the expiry time
            foundUser.emailToken = emailToken;
            foundUser.tokenExpiryTime = addHours(Date.now(), 2);
            await foundUser.save();
        } catch (error) {
            res.status(500).json({'message':error.message});
        }
        return res.status(400).json({'message':'Confirm your account before attempting to log in. Please check your mail.'})
    }

    //check password
    const match = await bcrypt.compare(password, foundUser.password);
    if(match){
        const roles = [foundUser.role];
        //create JWT
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.userName,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.userName },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        //set refresh token for user
        foundUser.refreshToken = refreshToken;
        foundUser.save();
        //set the refresh token in cookie
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });//secure: true might not work for Thunder Client
        res.status(200).json({ accessToken });
    } else {
        res.status(400).json({'message':'Password is not correct.'});
    }
};

const handleVerifyEmail = async (req, res) => {
    try {
        const token = req.body.token;
        if(!token) return res.status(404).json({'message':'Email token not found'});
        //Use the token to find the user
        const user = await Users.findOne({ emailToken: token }).exec();
        if(user){
            if(new Date(user.tokenExpiryTime).getTime() < new Date().getTime()){
                const origin = req.headers.origin;
                const filePath = path.join(__dirname, '..', 'views', 'VerifyEmail.html');
                const emailToken = crypto.randomBytes(64).toString("hex");
                //if(fs.filePath)
                let template = await fsPromises.readFile(filePath, 'utf8');
                let message = template
                                .replace("[[FIRSTNAME]]", user.firstName)
                                .replace("[[PERMALINK]]", `${origin}/verify-email?token=${emailToken}`)
                                .replace("[[YEAR]]", (new Date()).getFullYear());
                //send verification link to user
                const payLoad = { 
                    recipientEmail: user.emailAddress, 
                    recipientName: user.firstName, 
                    subject: "Verify Your Email", 
                    html: message
                };
                sendEmail(payLoad);
                //set the user token and the expiry time
                user.emailToken = emailToken;
                user.tokenExpiryTime = addHours(Date.now(), 2);
                await user.save();
                res.status(400).json({'message':'Token expired! Please verify with the new token sent to your email'});
            }
            //update the user
            user.emailToken = '';
            user.isEmailConfirmed = true;
            //save the changes
            await user.save();
            res.status(200).json({_id: user._id, isEmailConfirmed: user.isEmailConfirmed});
        } else {
            res.status(404).json({'message':'Email verification failed. Invalid token'});
        }
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const handleResetPassword = async (req, res) => {
    const user = await User.findOne({ emailAddress: req.body.emailAddress });
    if(!user) return res.status(404).json({'message':`No user found with the email: ${req.body.emailAddress}`});
    try {
            const origin = req.headers.origin;
            const filePath = path.join(__dirname, '..', 'views', 'ResetPassword.html');
            const emailToken = crypto.randomBytes(64).toString("hex");
            //if(fs.filePath)
            let template = await fsPromises.readFile(filePath, 'utf8');
            let message = template
                            .replace("[[FIRSTNAME]]", user.firstName)
                            .replace("[[PERMALINK]]", `${origin}/reset-password?token=${emailToken}`)
                            .replace("[[YEAR]]", (new Date()).getFullYear());
            //send verification link to user
            const payLoad = { 
                recipientEmail: user.emailAddress, 
                recipientName: user.firstName, 
                subject: "Reset Your Password",
                html: message
            };
            sendEmail(payLoad);
            //set the user token and the expiry time
            user.emailToken = emailToken;
            user.tokenExpiryTime = addHours(Date.now(), 2);
            await user.save();
            res.status(200).json({'message':'Please check your email for a link to change your password.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const handleChangeForgottenPassword = async (req, res) => {
    const { 
            newPassword, 
            confirmNewPassword, 
            token 
        } = req.body;

        if(newPassword !== confirmNewPassword)
            return res.status(400).json({'message':'Password and confirm password must match.'});
        if(!isValidPassword(newPassword)) return res.status(400).json({'message':'Password must have at least, a lowercase, an uppercase, a digit and a special character'});

        try {
            const user = await User.findOne({ emailToken: token });
            if(user){
                    if(new Date(user.tokenExpiryTime).getTime() < new Date().getTime()){
                        const origin = req.headers.origin;
                        const filePath = path.join(__dirname, '..', 'views', 'ResetPassword.html');
                        const emailToken = crypto.randomBytes(64).toString("hex");
                        //if(fs.filePath)
                        let template = await fsPromises.readFile(filePath, 'utf8');
                        let message = template
                                        .replace("[[FIRSTNAME]]", user.firstName)
                                        .replace("[[PERMALINK]]", `${origin}/reset-password?token=${emailToken}`)
                                        .replace("[[YEAR]]", (new Date()).getFullYear());
                        //send verification link to user
                        const payLoad = { 
                            recipientEmail: user.emailAddress, 
                            recipientName: user.firstName, 
                            subject: "Reset Your Password", 
                            html: message
                        };
                        sendEmail(payLoad);
                        //set the user token and the expiry time
                        user.emailToken = emailToken;
                        user.tokenExpiryTime = addHours(Date.now(), 2);
                        await user.save();
                        res.status(400).json({'message':'Token expired! Please verify with the new token sent to your email'});
                    }
                    user.emailToken = '';
                    //hash the new Password
                    const hashedPwd = await bcrypt.hash(newPassword, 10);
                    user.password = hashedPwd;
                    //save the changes
                    await user.save();
                    res.status(200).json({_id: user._id, isEmailConfirmed: true });
                } else {
                    res.status(404).json({'message':'User not found. Invalid token'});
                }
        } catch (error) {
           res.status(500).json({'message':error.message}); 
        }
}

const handleChangePassword = async (req, res) => {
    const userId = req.params.userId;
    const { 
            newPassword, 
            confirmNewPassword 
        } = req.body;
        if(newPassword !== confirmNewPassword)
            return res.status(400).json({'message':'Password and confirm password must match.'});
        if(!isValidPassword(newPassword)) return res.status(400).json({'message':'Password must have at least, a lowercase, an uppercase, a digit and a special character'});
        
        try {
            const user = await User.findOne({ _id: userId });
            if(user){
                const hashedPwd = await bcrypt.hash(newPassword, 10);
                user.password = hashedPwd;
                //save the changes
                await user.save();
                res.status(200).json({'message':'Password successfully changed'});
            } else {
                res.status(404).json({'message':`No user found with Id: ${userId}`});
            }
        } catch (error) {
            res.status(500).json({'message':error.message});
        }
}

module.exports = 
{ 
    handleLogin, 
    handleVerifyEmail,
    handleResetPassword,
    handleChangeForgottenPassword,
    handleChangePassword
};
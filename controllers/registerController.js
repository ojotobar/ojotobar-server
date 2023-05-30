const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../utils/sendEmail');
const crypto = require('crypto');
const validator = require("email-validator");
const validatePhoneNumber = require('validate-phone-number-node-js');
const ROLES = require('../config/roles_list');
const isValidPassword = require('../utils/isValidPassword');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { addHours } = require('date-fns')

const handleNewUser = async (req, res) => {
    const { 
            firstName, 
            lastName, 
            middleName, 
            emailAddress, 
            phoneNumber, 
            dateOfBirth, 
            password, 
            confirmPassword 
        } = req.body;
    if(!validator.validate(emailAddress)) return res.status(400).json({'message': 'Invalid email address'});
    if(!validatePhoneNumber.validate(phoneNumber)) return res.status(400).json({'message': 'Invalid phone number.'});
    if((new Date()).getTime() < (new Date(dateOfBirth).getTime())) return res.status(400).json({'message':'Your date of birth cannot be in the future'});
    if(!firstName || !lastName) return res.status(400).json({'message':'First Name and Last Name are required fields'});
    if(password !== confirmPassword) return res.status(400).json({'message': 'Password and Confirm Password must match'});
    if(!isValidPassword(password)) return res.status(400).json({'message':'Password must have at least, a lowercase, an uppercase, a digit and a special character'})

    //check for duplicated user
    const duplicate = await User.findOne({ emailAddress: emailAddress }).exec();
    if(duplicate) return res.status(409).json({'message':`Another user already registered with ${emailAddress}`});
    //Accept only one registered User
    const users = await User.find();
    if(users.length > 0) return res.status(400).json({'message':'No longer accepting registration.'});
    try {
        const emailToken = crypto.randomBytes(64).toString("hex");
        const hashedPwd = await bcrypt.hash(password, 10);
        const role = await Role.findOne({ role: ROLES.Admin }).exec();
        if(!role) res.status(400).json({'message':'Role not found'});
        
        //add new user
        const newUser = {
            "firstName": firstName,
            "lastName": lastName,
            "middleName": middleName,
            "emailAddress": emailAddress,
            "userName": emailAddress,
            "phoneNumber": phoneNumber,
            "dateOfBirth": new Date(dateOfBirth),
            "role": role?.role,
            "password": hashedPwd,
            "emailToken": emailToken,
            "tokenExpiryTime": addHours(Date.now(), 2)
        }
        await User.create(newUser);
        //Get email template
        const origin = req.headers.origin;
        const filePath = path.join(__dirname, '..', 'views', 'VerifyEmail.html');
        //if(fs.filePat)
        let template = await fsPromises.readFile(filePath, 'utf8');
        let message = template
                        .replace("[[FIRSTNAME]]", firstName)
                        .replace("[[PERMALINK]]", `${origin}/verify-email?token=${emailToken}`)
                        .replace("[[YEAR]]", (new Date()).getFullYear());
        //send verification link to user
        const payLoad = { 
            recipientEmail: emailAddress, 
            recipientName: firstName, 
            subject: "Verify Your Email", 
            html: message
        };
        sendEmail(payLoad);
        res.status(201).json({ 'message': 'Registration successful' });
    } catch (error) {
        res.status(500).json(({ 'message': error.message }));
    }
}

module.exports = { handleNewUser };
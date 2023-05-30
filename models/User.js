const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, required: false },
    emailAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    userName: { type: String, required: true },
    role: { type: Number, required: true },
    refreshToken: { type: String, default: '' },
    isEmailConfirmed: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: Date,
    password: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    publicId: { type: String, default: '' },
    emailToken: { type: String, default: '' },
    tokenExpiryTime: Date
});

module.exports = mongoose.model('User', userSchema);
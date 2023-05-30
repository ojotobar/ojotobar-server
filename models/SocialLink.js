const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socialLinkSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true }
});

module.exports = mongoose.model('SocialLink', socialLinkSchema);
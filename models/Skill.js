const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    userId: { type: String, required: true },
    skill: { type: String, required: true },
    level: { type: Number, required: true },
    iconUrl: { type: String, default: '' },
    publicId: { type: String, default: '' }
});

module.exports = mongoose.model('Skill', skillSchema);
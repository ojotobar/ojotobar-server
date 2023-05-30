const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    userId: { type: String, required: true },
    skill: { type: String, required: true },
    level: { type: Number, required: true }
});

module.exports = mongoose.model('Skill', skillSchema);
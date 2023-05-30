const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const educationSchema = new Schema({
    userId: { type: String, required: true },
    institution: { type: String, required: true },
    qualificationObtained: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date
});

module.exports = mongoose.model('Education', educationSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
    userId: { type: String, required: true },
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date
});

module.exports = mongoose.model('Experience', experienceSchema);
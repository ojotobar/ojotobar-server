const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const certificationSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    issuingBody: { type: String, required: true },
    issueDate: Date,
    certUrl: String
});

module.exports = mongoose.model('Certification', certificationSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const biographySchema = new Schema({
    userId: { type: String, required: true },
    biography: { type: String, required: true }
});

module.exports = mongoose.model('Biography', biographySchema);
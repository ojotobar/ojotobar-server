const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    techStacks: { type: String, required: true },
    url: String,
    pageUrl: { type: String, default: '' },
    pageUrlPublicId: { type: String, default: '' }
});

module.exports = mongoose.model('Project', projectSchema);
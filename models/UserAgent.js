const mongoose = require('mongoose');

const userAgentSchema = new mongoose.Schema({
    name: { type: String, required: true },
},{
    timestamps: true
});

module.exports = mongoose.model("UserAgent", userAgentSchema);
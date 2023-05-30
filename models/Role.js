const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = Schema({
   name: { type: String, required: true },
   role: { type: Number, required: true } 
});

module.exports = mongoose.model('Role', roleSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name cannot be blank']
    },
    ID: {
        type: String,
        required: [true, 'Admin ID cannot be blank']
    },
    mobile: Number,
    age: Number,
    sex: String,
    address: String
})

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
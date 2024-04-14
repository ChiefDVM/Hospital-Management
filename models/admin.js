const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Name cannot be blank']
    },
    ID: {
        type: String,
        required: [true, 'Admin ID cannot be blank']
    },
})

const options = {
    usernameField: 'ID'
}

adminSchema.plugin(passportLocalMongoose, options);


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
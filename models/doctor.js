const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const doctorSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Name cannot be blank']
    },
    ID: {
        type: String,
        required: [true, 'Doctor ID cannot be blank']
    },
    mobile: Number,
    age: Number,
    sex: String,
    speciality: String,
    address: String,
    histories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'History'
        }
    ]
})

const options = {
    usernameField: 'ID'
}

doctorSchema.plugin(passportLocalMongoose, options);

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
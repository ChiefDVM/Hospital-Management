const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const patientSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Name cannot be blank']
    },
    ID: {
        type: String,
        required: [true, 'Patient ID cannot be blank']
    },
    mobile: Number,
    age: Number,
    sex: String,
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

patientSchema.plugin(passportLocalMongoose, options);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
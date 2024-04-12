const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const patientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name cannot be blank']
    },
    ID: {
        type: String,
        required: [true, 'Patient ID cannot be blank']
    },
    mobile: Number,
    age: Number,
    sex: String,
    address: String
})

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
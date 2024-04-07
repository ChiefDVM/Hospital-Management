const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name cannot be blank']
    },
    ID: {
        type: String,
        required: [true, 'Doctor ID cannot be blank']
    },
    mobile: Number,
    age: Number,
    sex: String,
    speciality: String,
    address: String
})

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
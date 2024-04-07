const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    date: Date,
    Symptom: String,
    Prescription: String
});

const History = mongoose.model('History', historySchema);

module.exports = History;
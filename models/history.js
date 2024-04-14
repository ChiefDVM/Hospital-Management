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
    symptom: String,
    prescription: String
});

historySchema.virtual('formattedDate').get(function() {
    return this.date.toISOString().split('T')[0]; // Extracts date part in "year-month-day" format
  });

const History = mongoose.model('History', historySchema);

module.exports = History;
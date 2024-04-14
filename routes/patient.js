const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const {isLoggedIn} = require('../middleware');
const { patientSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const History = require('../models/history');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const validatePatient = (req, res, next) => {
    const { error } = patientSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

passport.use('patientStrategy', Patient.createStrategy({usernameField : 'ID'}));

passport.serializeUser(Patient.serializeUser());
passport.deserializeUser(Patient.deserializeUser());

router.get('/register', (req, res) => {
    res.render('main/registerPatient');
})

router.post('/register', catchAsync(async (req, res) => {
    let {username, password, ID} = req.body.patient;
    const patient = await Patient.findOne({ID: ID});

    if(patient && !patient.password) {
        ({username, ID, mobile, age, sex, address, histories} = patient);
        await Patient.deleteOne({ID: ID});
        const registeredPatient = await Patient.register({username, ID, mobile, age, sex, address, histories}, password);
        console.log(registeredPatient);
        res.redirect('/patient/login');
    } else if(patient && patient.password) {
        console.log('Patient account already exists');
        res.redirect('/patient/register');
    } else {
        console.log('No Patient found');
        res.redirect('/patient/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('patient/patientLogin');
})

router.post('/login', passport.authenticate('patientStrategy', {failureRedirect: '/patient/login'}), (req, res) => {
    req.flash('success', 'Welcome Back');
    res.redirect(`/patient/${req.user._id}`);
})

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    res.render('patient/home', {patient});
}))

router.put('/:id', validatePatient, catchAsync(async (req, res) => {
    const {id} = req.params;
    const updatedPatient = await Patient.findByIdAndUpdate(id, { ...req.body.patient });
    res.redirect(`/patient/${id}/info`);
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    res.render('patient/edit', {patient});
}))

router.get('/:id/info', catchAsync(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    res.render('patient/info', {patient})
}))

router.get('/:id/history', catchAsync(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    const histories = await History.find({patient: id}).populate('doctor');
    res.render('patient/medicalHistory', {patient, histories});
}))

router.get('/:id/addRecord', catchAsync(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    const doctors = await Doctor.find({});
    res.render('patient/addHistory', { patient, doctors });
}))

router.post('/:id/addRecord', catchAsync(async (req, res) => {
    const { id } = req.params;
    const { doctorID } = req.body.history;
    const patient = await Patient.findById(id);
    const doctor = await Doctor.findById(doctorID);
    const history = new History(req.body.history);
    history.patient = id;
    history.doctor = doctorID;
    doctor.histories.push(history);
    patient.histories.push(history);
    await history.save();
    await patient.save();
    await doctor.save();
    res.redirect(`/patient/${id}/history`);
}))

module.exports = router;
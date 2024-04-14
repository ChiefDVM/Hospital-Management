const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Doctor = require('../models/doctor');
const History = require('../models/history');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use('doctorStrategy', Doctor.createStrategy({usernameField : 'ID'}));

passport.serializeUser(Doctor.serializeUser());
passport.deserializeUser(Doctor.deserializeUser());

router.get('/register', (req, res) => {
    res.render('main/registerDoctor');
})

router.post('/register', catchAsync(async (req, res) => {
    let {username, password, ID} = req.body.doctor;
    const doctor = await Doctor.findOne({ID: ID});

    if(doctor && !doctor.password) {
        ({username, ID, mobile, age, sex, speciality, address, histories} = doctor);
        await Doctor.deleteOne({ID: ID});
        const registeredDoctor = await Doctor.register({username, ID, mobile, age, sex, speciality, address, histories}, password);
        console.log(registeredDoctor);
        res.redirect('/doctor/login');
    } else if(doctor && doctor.password) {
        console.log('Doctor account already exists');
        res.redirect('/doctor/register');
    } else {
        console.log('No Doctor found');
        res.redirect('/doctor/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('doctor/doctorLogin');
})

router.post('/login', passport.authenticate('doctorStrategy', {failureRedirect: '/doctor/login'}), (req, res) => {
    req.flash('success', 'Welcome Back');
    res.redirect(`/doctor/${req.user._id}`);
})

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    res.render('doctor/home', { doctor })
}))

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, { ...req.body.doctor });
    res.redirect(`/doctor/${id}/info`);
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    res.render('doctor/edit', {doctor});
}))

router.get('/:id/info', catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    res.render('doctor/info', {doctor})
}))

router.get('/:id/history', catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    const histories = await History.find({doctor: id}).populate('patient');
    res.render('doctor/medicalHistory', {doctor, histories});
}))

module.exports = router;
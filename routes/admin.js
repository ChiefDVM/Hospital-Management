const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');
const { patientSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError')
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

passport.use('adminStrategy', Admin.createStrategy({usernameField : 'ID'}));

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

router.get('/register', (req, res) => {
    res.render('main/registerAdmin');
})

router.post('/register', catchAsync(async (req, res) => {
    try{
        let {username, password, ID} = req.body.admin;
        const admin = new Admin({username: username, ID: ID});
        const registeredAdmin = await Admin.register(admin, password);
        res.redirect(`/admin/${username}`);
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/admin/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('admin/adminLogin');
});

router.post('/login', passport.authenticate('adminStrategy', {failureRedirect: '/admin/login'}), (req, res) => {
    req.flash('success', 'Welcome Back');
    res.redirect(`/admin/${req.user.username}`);
})


router.get('/:name/patients', catchAsync(async (req, res) => {
    const {name} = req.params;
    const admin = await Admin.findOne({username: name})
    const patients = await Patient.find({});
    res.render('admin/showPatients', {patients, admin});
}))

router.get('/:name/doctors', catchAsync(async (req, res) => {
    const {name} = req.params;
    const admin = await Admin.findOne({username: name})
    const doctors = await Doctor.find({});
    res.render('admin/showDoctors', {doctors, admin});
}))

router.get('/:name', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({username: name});
    res.render('admin/home', { admin });
}))

router.put('/:name', catchAsync(async (req, res) => {
    const { name } = req.params;
    const updatedAdmin = await Admin.findOneAndUpdate({username: name}, {...req.body.admin});
    res.redirect(`/admin/${req.body.admin.username}/info`);
}))

router.get('/:name/edit', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({username: name});
    res.render('admin/edit', { admin });
}))

router.get('/:name/info', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({username: name});
    res.render('admin/info', { admin });
}))

router.get('/:name/add-patient', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({username: name});
    res.render('admin/addPatient', { admin });
}))

router.post('/:name/add-patient', validatePatient, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const { name } = req.params;
    const newPatient = new Patient(req.body.patient);
    await newPatient.save();
    res.redirect(`/admin/${name}`);
}))

module.exports = router;
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');
const { patientSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError')

const validatePatient = (req, res, next) => {
    const { error } = patientSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/:name/patients', catchAsync(async (req, res) => {
    const {name} = req.params;
    const admin = await Admin.findOne({name: name})
    const patients = await Patient.find({});
    res.render('admin/showPatients', {patients, admin});
}))

router.get('/:name/doctors', catchAsync(async (req, res) => {
    const {name} = req.params;
    const admin = await Admin.findOne({name: name})
    const doctors = await Doctor.find({});
    res.render('admin/showDoctors', {doctors, admin});
}))

router.get('/:name', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({name: name});
    res.render('admin/home', { admin });
}))

router.get('/:name/info', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({name: name});
    res.render('admin/info', { admin });
}))

router.get('/:name/add-patient', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({name: name});
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
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Patient = require('../models/patient');
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

// app.post('/patientlogin', (req, res) => {})

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
    res.render('patient/medicalHistory', {patient})
}))

module.exports = router;
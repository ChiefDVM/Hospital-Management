const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Doctor = require('../models/doctor');

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
    res.render('doctor/medicalHistory', {doctor});
}))

module.exports = router;
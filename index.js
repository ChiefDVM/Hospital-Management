const express = require('express');
const app = express();
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const { patientSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const Patient = require('./models/patient');
const Doctor = require('./models/doctor');
const Admin = require('./models/admin');

mongoose.connect('mongodb://127.0.0.1:27017/chettinad-hospital')
    .then(() => {
        console.log("MONGO CONNECTION SECURED");
    })
    .catch(err => {
        console.log("MONGO ERROR");
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname + '/public'))) //this is to serve our static files 

const validatePatient = (req, res, next) => {
    const { error } = patientSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.send("HELLO")
})

app.get('/login', (req, res) => {
    res.render('main/mainLogin');
})

//ADMIN ROUTES
app.get('/adminlogin', (req, res) => {
    res.render('admin/adminLogin');
})

app.get('/admin/:name/patients', catchAsync(async (req, res) => {
    const {name} = req.params;
    const admin = await Admin.findOne({name: name})
    const patients = await Patient.find({});
    res.render('admin/showPatients', {patients, admin});
}))

app.get('/admin/:name/doctors', catchAsync(async (req, res) => {
    const {name} = req.params;
    const admin = await Admin.findOne({name: name})
    const doctors = await Doctor.find({});
    res.render('admin/showDoctors', {doctors, admin});
}))

app.get('/admin/:name', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({name: name});
    res.render('admin/home', { admin });
}))

app.get('/admin/:name/info', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({name: name});
    res.render('admin/info', { admin });
}))

app.get('/admin/:name/add-patient', catchAsync(async (req, res) => {
    const { name } = req.params;
    const admin = await Admin.findOne({name: name});
    res.render('admin/addPatient', { admin });
}))

app.post('/admin/:name/add-patient', validatePatient, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const { name } = req.params;
    const newPatient = new Patient(req.body.patient);
    await newPatient.save();
    res.redirect(`/admin/${name}`);
}))

//PATIENT ROUTES
app.get('/patientlogin', (req, res) => {
    res.render('patient/patientLogin');
})

// app.post('/patientlogin', (req, res) => {})

app.get('/patient/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    res.render('patient/home', {patient});
}))

app.put('/patient/:id', validatePatient, catchAsync(async (req, res) => {
    const {id} = req.params;
    const updatedPatient = await Patient.findByIdAndUpdate(id, { ...req.body.patient });
    res.redirect(`/patient/${id}/info`);
}))

app.get('/patient/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    res.render('patient/edit', {patient});
}))

app.get('/patient/:id/info', catchAsync(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    res.render('patient/info', {patient})
}))

app.get('/patient/:id/history', catchAsync(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    res.render('patient/medicalHistory', {patient})
}))

//DOCTOR ROUTES
app.get('/doctorlogin', (req, res) => {
    res.render('doctor/doctorLogin');
})

app.get('/doctor/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    res.render('doctor/home', { doctor })
}))

app.put('/doctor/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, { ...req.body.doctor });
    res.redirect(`/doctor/${id}/info`);
}))

app.get('/doctor/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    res.render('doctor/edit', {doctor});
}))

app.get('/doctor/:id/info', catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    res.render('doctor/info', {doctor})
}))

app.get('/doctor/:id/history', catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    res.render('doctor/medicalHistory', {doctor});
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})
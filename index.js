const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const catchAsync = require('./utils/catchAsync');

const patientRoutes = require('./routes/patient');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const Patient = require('./models/patient');
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

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => { // every template will have access to this information
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.send("HELLO")
})

app.get('/login', (req, res) => {
    res.render('main/mainLogin');
})

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
})

app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/admin', adminRoutes);

//DOCTOR ROUTES
app.get('/doctorlogin', (req, res) => {
    res.render('doctor/doctorLogin');
})


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
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/user');
const router = require('./routes/playlists');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const initializePassport = require('./passport-config');

initializePassport(passport);

const app = new express();

app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/playlists", { useNewUrlParser: true, useUnifiedTopology: true });

function generateRandomString(length) {
    let possible = 'QWERTYUIOPASDFGHJKLÑZXCVBNMqwertyuiopasdfghjklñzxcvbnm1234567890';
    let string = '';
    for (let i = 0; i < length; i++) {
        string += possible[Math.floor(Math.random() * length)];
    }

    return string;
}

const client_id = process.env.CLIENT_ID;
const redirect_uri = 'http://127.0.0.1:5000/playlists/';
var state = generateRandomString(16);
var scope = process.env.SCOPE;

app.post('/login', (req, res, next) => {
    console.log(req.body.username);
    passport.authenticate('local', (err, user, info) => {
      console.log(user);
      if (err) { 
        return next(err);
      }
  
      if (!user) {
        return res.redirect('/login');
      }
  
      req.login(user, (err) => {
        if (err) { 
          return next(err);
        }
    
        return res.redirect(`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`);
      });
    })(req, res, next);
});
  


app.get('/', (req, res) => {
    res.locals.title = 'Home';
    res.render('index');
});

app.get('/register', (req, res) => {
    res.locals.title = 'Register';
    res.render('register');
})

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            collaboratesIn: []
        });
        req.user = newUser;
    
        newUser.save();
  
        res.redirect('/playlists');
    } catch {
        res.redirect(`/`);
    }
});

app.get('/login', (req, res) => {
    res.locals.title = 'Log In';

    res.render('login');
});

app.use('/playlists', router);

app.use(function (req,res) {
    res.locals.title = '404 Error';
    res.status(404).render('error.ejs');
});

app.listen(5000, () => {
    console.log('Working.')
});
var express               = require("express"),
    app                   = express(),
    bodyParser            = require('body-parser'),
    LocalStrategy         = require('passport-local'),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User                  = require('./models/user');

mongoose.connect('mongodb://localhost/auth_demo');

app.use(require('express-session')({
  secret: 'A man, a plan, a canal, Panama.',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));  // parses out data, e.g. from registration form

app.use(passport.initialize());  // these two lines are required for Passport
app.use(passport.session());  
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ============
//    ROUTES
// ============
app.get('/', (req, res) => { res.render('home'); });

// SHOW SIGNUP FORM
app.get('/register', (req, res) => { res.render('register'); });

app.post('/register', (req, res) => {
  User.register(new User({ 
    username: req.body.username}),
    req.body.password, 
    function (err, user) {
      if(err){
        console.log(err);
        return res.render('register');
      } else {
        passport.authenticate('local')(req, res, function(){ // 'local' means 'Local Strategy' for Passport
          res.redirect('/secret');
        });
      }
    });
});

app.get('/secret', (req, res) => { res.render('secret'); });

app.listen(3000, () => { console.log('Web server started on Port 3000....'); });
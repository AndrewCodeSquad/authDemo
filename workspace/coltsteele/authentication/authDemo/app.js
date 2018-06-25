var express               = require("express"),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    bodyParser            = require('body-parser'),
    User                  = require('./models/user'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/auth_demo');
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));  // parses out data, e.g. from registration form
app.use(require('express-session')({
  secret: 'A man, a plan, a canal, Panama.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());  // these two lines are required for Passport
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ============
//    ROUTES
// ============
app.get('/', (req, res) => { res.render('home'); });

// REGISTER ROUTES
// Show signup form 
app.get('/register', (req, res) => { res.render('register'); });

// Handle user signup
app.post('/register', (req, res) => {
  User.register(new User({ 
    username: req.body.username}),
    req.body.password, 
    function (err, user) {
      if(err){
        console.log(err);
        return res.render('register');
      }
        passport.authenticate('local')(req, res, function(){ // 'local' means 'Local Strategy' for Passport
          res.redirect('/secret');
        });
    });
});

// SHOW SECRET PAGE
app.get('/secret', isLoggedIn, (req, res) => { res.render('secret'); });

// LOGIN ROUTES
// Show the Login page
app.get('/login', (req, res) => { res.render('login'); });

// Authenticate the user
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }), function (req, res) { });

// Show Log out page
app.get('/logout', (req, res) => {
  req.logout();  // this clears the authentication session from database
  res.redirect('/');
});

// Check if user is logged in
function isLoggedIn(req, res, next){  // Middleware functions all take these same 3 arguments
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

app.listen(3000, () => { console.log('Web server started on Port 3000....'); });
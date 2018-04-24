var express = require('express');
var router = express.Router();
var passport = require('passport');
var Quote = require('../models/quote');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});


/* GET Login page*/
router.get('/login', function(req, res, next){
    res.render('login');
});

/* GET Sign Up page*/
router.get('/signup', function(req, res, next){
    res.render('signup');
});

/* POST to login */
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/quote',
    failureRedirect: '/login',
    failureFlash: true
}));

/* POST to signup */
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/quote',
    failureRedirect: '/login',
    failureFlash: true
}))

/* GET quote page and render any existing quotes for the user */
router.get('/quote', isLoggedIn, function(req, res, next){
    var user = req.user.local;
    Quote.find({userID: user.id})
        .then( (docs) => {res.render('quote', {title:'My Quotes', quotes: docs});
            username: user.username
        })
        .catch( (err) => {
            next(err);
        });
 });

/*middleware to verify user is logged in*/
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/login');
    }
}

/* GET logout page */
router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});


module.exports = router;

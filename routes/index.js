var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/secret');
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
    successRedirect: '/secret',
    failureRedirect: '/login',
    failureFlash: '/true'
}));

/* POST to signup */
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/secret',
    failureRedirect: '/login',
    failureFlash: true
}))

/* GET secret page */
router.get('/secret', isLoggedIn, function(req, res, next){
    var user = req.user.local;
    res.render('secret', {
        username: user.username
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
router.get('logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});


module.exports = router;

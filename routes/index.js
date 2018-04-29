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

    //find all quotes where the current logged in user corresponds to the userID in the quote
    Quote.find({userID: user._id})
        .then( (docs) => {res.render('quote', {title:'My Quote Requests', quotes: docs});
            username: user.username
        })
        .catch( (err) => {
            next(err);
        });
 });

/*POST to create a new quote request*/
router.post('/add', function(req, res, next){

    //validate that all required fields in the request body have data
    if( req.body.name && req.body.description && req.body.budget){

        //create the quote request
        var q = new Quote({name: req.body.quoteName, description: req.body.description, budget: req.body.budget, userID: req.body.user_id})

        //save the quote to the database and redirect to the quote page
        q.save().then( (newQuote) => {
            console.log("New quote request created: " + newQuote);
            res.redirect('/quote');
        }).catch(()=> {
            next(err);
        });
    }
    else{
        res.redirect('index');
    }
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

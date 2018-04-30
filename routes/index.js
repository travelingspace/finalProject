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

    //get the authenticated user object
    var authUser = req.user;
    //get the string of the _id of the authenticated user
    var userIdString = authUser._id.toString();

    //find all quotes where the current logged in user corresponds to the userID in the quote
    Quote.find({userID: userIdString, status: 1})
        .then( (docs) => {res.render('quote', {title:'My Quote Requests', quotes: docs, username: authUser.local.username, userID: userIdString});
        })
        .catch( (err) => {
            next(err);
        });
 });

/*POST to create a new quote request*/
router.post('/add', function(req, res, next){

    //validate that all required fields in the request body have data
    if (!(req.body.quoteName && req.body.description && req.body.budget && req.body.user_id)) res.redirect('/quote');
    else {
        //create the quote request
        var q = new Quote({
            name: req.body.quoteName,
            description: req.body.description,
            budget: req.body.budget,
            userID: req.body.user_id
        });

        //save the quote to the database and redirect to the quote page
        q.save().then((newQuote) => {
            console.log("New quote request created: ", newQuote);
            res.redirect('/quote');
        }).catch(() => {
            next(err);
        });
    }
});

/*POST to deactivate a quote request*/
router.post('/deactivate', function(req, res, next){

    Quote.findByIdAndUpdate(req.body._id, {status: 0})//find the quote record and update the status parameter to 0, which deactivates the quote record
        .then( (originalQuote) => {
            if(originalQuote){
                res.redirect('/quote');//if quote was found, then redirect to the quotes page
            } else{
                var err = new Error('Quote Request Not found - could not deactivate');//throw custom error message if something went wrong
                err.status = 404;
                next(err);
            }
        })
        .catch( (err) => {
            next(err);
        })

})

/*GET deactivated Quote Requests*/
router.get('/deactivated', function(req, res, next){

    //get the authenticated user object
    var authUser = req.user;
    //get the string of the _id of the authenticated user
    var userIdString = authUser._id.toString();

    Quote.find({status: 0, userID: userIdString})
        .then( (docs) => {
            res.render('deactivated_quotes', {quotes: docs});
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

var User       = require('../app/models/user');
async = require("async");
var path = require('path'), fs = require('fs');
module.exports = function(app, passport, server) {

// normal routes ===============================================================

    // PROFILE SECTION =========================
    app.get('/monitor', isLoggedIn, function(req, res) {
        res.render('monitor.htm', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('login.htm');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
    //console.log("in login")
        app.get('/login', function(req, res) {
        	//console.log("in login")
        	console.log(req)
    
            res.render('login.htm', { message: req.flash('message') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/monitor', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            //failureFlash : true // allow flash messages
            failureFlash: 'Invalid username or password.'
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/registration', function(req, res) {
        	//console.log("aaa");
            res.render('registration.htm', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/registration', passport.authenticate('local-signup', {
            //successRedirect : '/login', // redirect to the secure profile section
            successReturnToOrRedirect: '/login',
            failureRedirect : '/registration', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

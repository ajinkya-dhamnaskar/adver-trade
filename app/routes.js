var User = require('../app/models/user');
var Item = require('../app/models/item');
async = require("async");
var path = require('path'), fs = require('fs');
module.exports = function(app, passport, server) {

	// normal routes ===============================================================
	
	function getItems(res) {
	    Item.find(function (err, items) {

	        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
	        if (err) {
	            res.send(err);
	        }

	        res.json(items); // return all todos in JSON format
	    });
	}
	;
	
	// PROFILE SECTION =========================
	app.get('/monitor', isLoggedIn, function(req, res) {
		res.render('monitor.htm', {

			user : req.user.local.username
		});
	});
	
	app.post('/browse', isLoggedIn, function(req, res) {
		getItems(res);
		res.render('browse.htm', {
			user : req.user.local.username, 
			category : req.body.category
		});
	});

	app.get('/header', isLoggedIn, function(req, res) {
		res.render('static/header.htm', {
			user : req.user.local.username
		});
	});

	// LOGOUT ==============================
	app.post('/logout', isLoggedIn, function(req, res) {
		req.logout();
		res.render('login.htm', {
			message : req.flash('Logged Out')
		});
	});

	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

	// locally --------------------------------
	// LOGIN ===============================
	// show the login form
	//console.log("in login")
	app.get('/', function(req, res) {
		//console.log("in login")
		//console.log(req)

		res.render('login.htm', {
			message : req.flash('message')
		});
	});

	app.get('/login', function(req, res) {
		//console.log("in login")
		//console.log(req)

		res.render('login.htm', {
			message : req.flash('message')
		});
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/monitor', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		//failureFlash : true // allow flash messages
		failureFlash : 'Invalid username or password.'
	}));

	// SIGNUP =================================
	// show the signup form
	app.get('/registration', function(req, res) {
		res.render('registration.htm', {
			message : req.flash('signupMessage')
		});
	});

	app.get('/about', function(req, res) {
		//console.log("aaa");
		res.render('about.htm', {
			user : req.user.local.username
		})
	});

	app.get('/contact', function(req, res) {
		res.render('contact.htm', {
			user : req.user.local.username
		})
	});

	// process the postad form
	app.post('/postad', function(request, response) {

		var newItem = new Item();
		//console.log(request);
		newItem.item.title = request.body.title;
		newItem.item.price = request.body.price;
		newItem.item.category = request.body.category;
		newItem.item.username = request.user.local.username;
		newItem.item.description = request.body.description;

		newItem.save(function(err) {
			if (err) {
				throw err;
			}

			response.render('monitor.htm', {
				user : request.user.local.username
			})
		});

	});
	
	//Datatable
	
	app.post('/registration', passport.authenticate('local-signup', {
		//successRedirect : '/login', // redirect to the secure profile section
		successReturnToOrRedirect : '/login',
		failureRedirect : '/registration', // redirect back to the signup page if there is an error
		failureFlash : true
	// allow flash messages
	}));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}

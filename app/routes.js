var User = require('../app/models/user');
var Item = require('../app/models/item');
var Category = require('../app/models/category');
async = require("async");
var path = require('path'), fs = require('fs');
var ObjectId = require('mongodb').ObjectID
var mongo = require('mongodb');

module.exports = function(app, passport, server, multer, mongoose, Grid) {

	// normal routes
	// ===============================================================

	var conn = mongoose.connection;
	Grid.mongo = mongoose.mongo;
	var storage = multer.diskStorage({
		destination : function(req, file, callback) {
			callback(null, './uploads');
		},
		filename : function(req, file, callback) {
			callback(null, file.fieldname + '-' + Date.now());
		}
	});
	var upload = multer({
		storage : storage
	}).array('file');
	var gfs;
	conn.once('open', function() {
		gfs = Grid(conn.db, mongo);
		app.set('gridfs', gfs);
	})

	// process the postad form
	app.post('/postad', upload, function(request, response) {

		var GridStream = require('gridfs-stream');
		var mongodb = require('mongodb');
		var gfs = new GridStream(mongoose.connection, mongodb);
		var fs = require('fs');
		var url = require("url");
		var newItem = new Item();
		var fileName = new String();
		newItem.item.title = request.body.title;
		newItem.item.price = request.body.price;
		newItem.item.name = request.body.category;

		newItem.item.username = request.user.local.username;
		newItem.item.description = request.body.description;

		newItem.save(function(err) {
			if (err) {
				throw err;
			}

			// images are attached

			var writeStream = gfs.createWriteStream({
				filename : request.files.originalname,

				metadata : {
					"productTitle" : request.body.title,
					"sellerID" : request.user.local.email
				}
			});
			fs.createReadStream("" + request.files.path).pipe(writeStream);

			Category.find({}, function(err, categories) {
				response.render('monitor.htm', {
					categories : categories,
					user : request.user.local.username
				});

			})
		});
	});
	
	app.post('/adDetails', isLoggedIn, function(req, res) {
		console.log(req.body.id);
		Category.find({}, function(err, categories) {
			Item.findOne({
				'_id' : ObjectId(req.body.id)
			},

			function(err, item) {
				console.log(item);
				
				User.findOne({
					'local.username' : item.item.username
				}, function(err, user) {
					
				console.log(user)	
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({
					message : "Edited Successfully",
					username : user.local.username,
					userfirstname : user.local.firstname,
					userlastname : user.local.lastname,
					useremail : user.local.email,
					userphone : user.local.phone,
					itemId : ObjectId(req.body.id),
					itemTitle : item.item.title,
					itemPrice : item.item.price,
					itemName : item.item.name,
					itemDesp : item.item.description,
					categories : categories,
					user : req.user.local.username,
					useremail : req.user.local.username,
					
					isErr : false
				}));
				res.render('adDetails.htm', {
					categories : categories,
					user : req.user.local.username
				});

			});
				
			});

		});
	});

	// PROFILE SECTION =========================
	app.get('/monitor', isLoggedIn, function(req, res) {

		Category.find({}, function(err, categories) {
			res.render('monitor.htm', {
				categories : categories,
				user : req.user.local.username
			});
		});

	});
	//
	// app.post('/browse', isLoggedIn, function(req, res) {
	// getItems(res);
	// res.render('browse.htm', {
	// user : req.user.local.username,
	// category : req.body.category
	// });
	// });

	// app
	// .post(
	// '/path/to/api/endpoint',
	// function(req, res) {
	// var Model = require('../app/models/item'), datatablesQuery =
	// require('datatables-query'), params = req.body, query =
	// datatablesQuery(Model);
	//
	// query.run(params).then(function(data) {
	// res.json(data);
	// }, function(err) {
	// res.status(500).json(err);
	// });
	// });

	app.post('/browse', isLoggedIn, function(req, res) {

		Category.find({}, function(err, categories) {
			Item.find({
				"item.name" : req.body.category
			}, function(err, items) {
				res.render('browse.htm', {
					user : req.user.local.username,
					category : req.body.category,
					items : items,
					categories : categories
				});
			});

		});

	});

	app.get('/browse', isLoggedIn, function(req, res) {

		Category.find({}, function(err, categories) {
			Item.find({
				"item.name" : req.body.category
			}, function(err, items) {
				//console.log(items);
				res.render('browse.htm', {
					user : req.user.local.username,
					category : req.body.category,
					items : items,
					categories : categories
				});
			});

		});

	});

	app.post('/deleteAd', isLoggedIn, function(req, res) {
		console.log(req.body.id);
		console.log("\"" + req.body.id + "\"");
		Category.find({}, function(err, categories) {
			Item.remove({
				'_id' : ObjectId(req.body.id)
			}, function(err, items) {
				console.log(items);
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({
					message : "Deleted Successfully",
					isErr : false
				}));
			});
		});

	});

	app.get('/managead', isLoggedIn, function(req, res) {
		Category.find({}, function(err, categories) {
			Item.find({
				"item.username" : req.user.local.username
			}, function(err, items) {
				res.render('managead.htm', {
					user : req.user.local.username,
					category : req.body.category,
					items : items,
					categories : categories
				});
			});
		});

	});

	app.get('/browseAll', isLoggedIn, function(req, res) {

		Category.find({}, function(err, categories) {
			Item.find({

			}, function(err, items) {
				//console.log(items);
				res.render('browse.htm', {
					user : req.user.local.username,
					category : req.body.category,
					items : items,
					categories : categories
				});
			});

		});

	});
	app.get('/header', isLoggedIn, function(req, res) {
		res.render('static/header.htm', {
			user : req.user.local.username
		});
	});

	app.get('/editAdDB', isLoggedIn, function(req, res) {

		Item.update({
			_id : req.body.id
		}, {
			'item.title' : req.body.title,
			'item.price' : req.body.price,
			'item.name' : req.body.category,
			'item.description' : req.body.description
		}, function() {
			res.redirect("/managead")
		})
	});

	// LOGOUT ==============================
	app.post('/logout', isLoggedIn, function(req, res) {
		req.logout();
		res.render('login.htm', {
			message : req.flash('Logged Out')
		});
	});

	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN)
	// ==================================================
	// =============================================================================

	// locally --------------------------------
	// LOGIN ===============================
	// show the login form
	// console.log("in login")
	app.get('/', function(req, res) {
		res.render('login.htm', {
			message : req.flash('message')
		});
	});

	app.get('/login', function(req, res) {
		res.render('login.htm', {
			message : req.flash('message')
		});
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/monitor', // redirect to the secure profile
		failureRedirect : '/login', // redirect back to the signup page if there
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
		Category.find({}, function(err, categories) {
			res.render('about.htm', {
				user : req.user.local.username,
				categories : categories
			})
		});
	});

	app.get('/contact', function(req, res) {
		Category.find({}, function(err, categories) {
			res.render('contact.htm', {
				user : req.user.local.username,
				categories : categories
			})
		});
	});

	app.post('/editAdDB', isLoggedIn, function(req, res) {

		Item.update({
			_id : req.body.id
		}, {
			'item.title' : req.body.title,
			'item.price' : req.body.price,
			'item.name' : req.body.category,
			'item.description' : req.body.description
		}, function() {
			res.redirect("/managead")
		})
	});

	app.post('/editAd', isLoggedIn, function(req, res) {

		Category.find({}, function(err, categories) {
			Item.findOne({
				'_id' : ObjectId(req.body.id)
			},

			function(err, item) {

				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({
					message : "Edited Successfully",
					itemId : ObjectId(req.body.id),
					itemTitle : item.item.title,
					itemPrice : item.item.price,
					itemName : item.item.name,
					itemDesp : item.item.description,
					categories : categories,
					user : req.user.local.username,
					isErr : false
				}));
				
				
			});

		});

	});

	// Datatable

	app.post('/registration', passport.authenticate('local-signup', {
		successReturnToOrRedirect : '/login',
		failureRedirect : '/registration', // redirect back to the signup page
		failureFlash : true
	}));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}

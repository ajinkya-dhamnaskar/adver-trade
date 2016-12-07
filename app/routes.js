var User = require('../app/models/user');
var Item = require('../app/models/item');
var Category = require('../app/models/category');
async = require("async");
var path = require('path'), fs = require('fs');
var ObjectId = require('mongodb').ObjectID
var mongo = require('mongodb');
var nodemailer = require('nodemailer');
//var newGrid = require('../models/fsfiles');
module.exports = function(app, passport, server, multer, mongoose, Grid, conn) {

	// normal routes
	// ===============================================================

	//var conn = mongoose.connection;
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
	gfs = Grid(conn.db, mongo);
	app.set('gridfs', gfs);


	// process the postad form
	app.post('/postad', upload, function(request, response) {
		console.log(request)
		var GridStream = require('gridfs-stream');
		//var mongodb = require('mongodb');
		//var gfs = new GridStream(conn, mongodb);
		var fs = require('fs');
		var url = require("url");
		var newItem = new Item();
		var fileName = new String();
		newItem.item.title = request.body.title;
		newItem.item.price = request.body.price;
		newItem.item.name = request.body.category;

		newItem.item.username = request.user.local.username;
		newItem.item.description = request.body.description;
		newItem.item.imagePath = request.files[0].filename;
		newItem.save(function(err, item) {
			if (err) {
				throw err;
			}
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
		// console.log(req)
		var itemsCount = [];
		Category.find({}, function(err, categories) {
			// console.log(categories)

			var i = 0;
			categories.forEach(function(category) {
				Item.count({
					'item.name' : category["category"]["name"]
				}, function(err, count) {
					// console.log(count);
					itemsCount[category["category"]["name"]] = count;
					console.log(itemsCount[category["category"]["name"]])

				})

			})
			res.render('monitor.htm', {
				categories : categories,
				user : req.user.local.username,
				itemsCnt : itemsCount
			});

		});

	});
	app.post('/browse', isLoggedIn, function(req, res) {

		Category.find({}, function(err, categories) {
			Item.find({
				"item.name" : req.body.category
			}, function(err, items) {
				res.render('browse.htm', {
					user : req.user.local.username,
					userEmail	: req.user.local.email,
					userName : req.user.local.firstname + " " + req.user.local.lastname,

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
				// console.log(items);
				res.render('browse.htm', {
					user : req.user.local.username,
					userEmail	: req.user.local.email,
					userName : req.user.local.firstname + " " + req.user.local.lastname,
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


	app.post('/sendEmail', isLoggedIn, function(req, res) {

	var sender = req.user.local.username

		Category.find({}, function(err, categories) {
			Item.findOne({
				'_id' : ObjectId(req.body.id)
			}, function(err, item) {
				User.findOne({'local.username' : item.item.username}, function(err, user){
				console.log(user.local.email);
				console.log(req.body.message);
				console.log(item.item.title);
				
				var smtpTransport = nodemailer.createTransport('SMTP', {
					service: 'Gmail',
					auth: {
						user: 'advertradeuser@gmail.com',
						pass: 'adver123'
					}
				});

				var mailOptions = {
					to: user.local.email,
					from: 'advertradeuser@gmail.com',
					subject: '[AdverTrade]: Response for your Ad  : Title : '+ item.item.title,
				  text:	'Sender: ' + sender + '\nSender Message: '+req.body.message  + '\n' +
					'Item Details :\nTitle:'+ item.item.title+'\n'+ 'Description: '+item.item.description + '\nPrice: '+item.item.price+ '\n\n'+
					'An e-mail has been sent to you as a reponse to your Ad. Login to AdverTrade to contact back the sender. '+'\n'

				};
				smtpTransport.sendMail(mailOptions, function(error, info){
						 if(error){
							 console.log(error);
						 }
			});

				})
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
				// console.log(items);

				res.render('browse.htm', {
					user : req.user.local.username,
					userEmail	: req.user.local.email,
					userName : req.user.local.firstname + " " + req.user.local.lastname,
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
		console.log(req);
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

	app.post('/logout', isLoggedIn, function(req, res) {
		req.logout();
		res.render('login.htm', {
			message : req.flash('Logged Out')
		});
	});

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
	
	app.post('/editAdDB', isLoggedIn, upload, function(req, res) {
		console.log(req);
		Item.update({
			_id : req.body.id
		}, {
			'item.title' : req.body.title,
			'item.price' : req.body.price,
			'item.name' : req.body.category,
			'item.imagePath' : req.files[0].filename,
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

	app.get('/contact', isLoggedIn, function(req, res) {

		Category.find({}, function(err, categories) {
		User.findOne({
				'local.username' : req.user.local.username
			}, function(err, user) {
				res.render('contact.htm', {
					user : user.local.username,
					email : user.local.email,
					message: req.flash('success'),
					categories : categories
				});
			});

		});
	});

	app.post('/contact',isLoggedIn, function(req, res) {
		var smtpTransport = nodemailer.createTransport('SMTP', {
			service: 'Gmail',
			auth: {
				user: 'advertradeuser@gmail.com',
        pass: 'adver123'
			}
		});

		var mailOptions = {
			to: 'advertradeuser@gmail.com',
			from: req.body.email,
			subject: 'AdverTrade Contacted by User: '+req.body.name+'::'+req.body.email + ' Message subject : '+ req.body.subject,
			text: 'User Message: '+req.body.message
		};
		smtpTransport.sendMail(mailOptions, function(error, info){
		     if(error){
					 	req.flash('success', 'Error in sending email');
		        res.redirect('/contact');
		     }
				 req.flash('success', 'An e-mail has been sent to  us  with your questions. We will contact you back soon.');
				 res.redirect('/contact');
	});


});

//end
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}

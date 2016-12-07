var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');
var db = mongoose.connect(configDB.url);
var conn = mongoose.createConnection(configDB.url);
var Category = require('./app/models/category.js');
conn.on('open', function () {
    conn.db.listCollections({name: "categories"})
    .next(function(err, collinfo) {
        if (!collinfo) {

        	Category.insertMany([ {
        	    'category.ID': 1, 'category.name': "Cars and Motors",  'category.image': "fa fa-car"
        	 },
        	 {
        		   'category.ID': 2, 'category.name': "Books", 'category.image': "fa fa-book"
        	 },
        	 {
        		   'category.ID': 3, 'category.name': "Electronics", 'category.image': "fa fa-laptop"
        	 },
        	 {
        		   'category.ID': 4, 'category.name': "Furniture", 'category.image': "fa fa-bed"
        	 },
        	 {
        		   'category.ID': 5, 'category.name': "Sportssss", 'category.image': "fa fa-futbol-o"
        	 },
        	 {
        		   'category.ID': 6, 'category.name': "Household", 'category.image': "fa fa-lightbulb-o"
        	 },
        	 {
        		   'category.ID': 7, 'category.name': "Data and Accessories", 'category.image': "fa fa-eye"
        	 }

        	 ]);
        }

    });
});


var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var contentTypes = {
	'.html' : 'text/html',
	'.htm' : 'text/html',
	'.css' : "text/css",
	'.js' : 'application/javascript',
	'.woff' : 'text/plain',
	'.jpg' : 'image/jpg',
	'.jpeg' : 'image/jpg;',
	'.png' : 'image/png;'
};
var server = http.createServer(app);
var Grid  = require('gridfs-stream');
var multer   = require('multer');
var bodyParser   = require('body-parser');

app.engine('htm', require('ejs').renderFile);

app.use(express.static(__dirname + '/'));
app.set('view engine', 'htm');

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({ dest: './uploads'}));


// required for passport
require('./config/passport')(passport);
app.use(session({
	secret : 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport, server, multer, mongoose, Grid, conn);

// Console will print the message
server.listen(port);
console.log('Listening  to  port ' + port);

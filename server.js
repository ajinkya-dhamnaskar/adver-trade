//var http = require('http');
//http.createServer(function handler(req, res) {
//    res.writeHead(200, {'Content-Type': 'text/plain'});
//    res.end('Hello World\n');
//}).listen(1337, '127.0.0.1');
//console.log('Server running at http://127.0.0.1:1337/');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var io = require('socket.io');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

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
var server = http.createServer(app)

/*//Create a server
 http.createServer(function(request, response) {
 // Parse the request containing file name
 var pathname = url.parse(request.url).pathname;
 // figure out MIME type by file ext
 var contentType = contentTypes[path.extname(pathname)];
 // Print the name of the file for which request is made.
 console.log("Request for " + pathname + " received.");

 // Read the requested file content from file system
 fs.readFile(pathname.substr(1), function(err, data) {
 if (err) {
 console.log(err);
 // HTTP Status: 404 : NOT FOUND
 // Content Type: text/plain
 response.writeHead(404, {
 'Content-Type' : 'text/html'
 });
 } else {
 // Page found
 // HTTP Status: 200 : OK
 // Content Type: text/plain
 response.writeHead(200, {
 'Content-Type' : contentType
 });
 // response.contentType(request.params.file);
 // Write the content of the file to response body
 // response.write(data.toString());

 }
 // Send the response body
 response.end(data, 'binary');
 });
 }).listen(8081);*/
// configuration ===============================================================

//app.set('views', '../views');
app.engine('htm', require('ejs').renderFile);
app.use(express.static(__dirname, 'css'));

app.use(express.static(__dirname, 'views/static'));
app.use(express.static(__dirname, 'js'));
app.use(express.static(__dirname, 'img'));
app.set('view engine', 'htm');

mongoose.connect(configDB.url); // connect to our database

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//routes ======================================================================
// load our routes and pass in our
// app and fully configured passport

// required for passport
require('./config/passport')(passport);
app.use(session({
	secret : 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



require('./app/routes.js')(app, passport, server);

// launch ======================================================================
// app.listen(port);
//console.log('The magic happens on port ' + port);

// Console will print the message
server.listen(port);
console.log('Listening  to  port ' + port);
//var http = require('http');
//http.createServer(function handler(req, res) {
//    res.writeHead(200, {'Content-Type': 'text/plain'});
//    res.end('Hello World\n');
//}).listen(1337, '127.0.0.1');
//console.log('Server running at http://127.0.0.1:1337/');
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var contentTypes = {
	    '.html': 'text/html',
	    '.htm': 'text/html',
	    '.css': "text/css",
	    '.js': 'application/javascript',
	    '.woff': 'text/plain',
	    '.jpg' : 'image/jpg',
	    '.jpeg' : 'image/jpg;',
	    '.png' : 'image/png;'
	};
// Create a server
http.createServer( function (request, response) {  
   // Parse the request containing file name
   var pathname = url.parse(request.url).pathname;
   // figure out MIME type by file ext
   var contentType = contentTypes[path.extname(pathname)];
   // Print the name of the file for which request is made.
   console.log("Request for " + pathname + " received.");
   
   // Read the requested file content from file system
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {	
         //Page found	  
         // HTTP Status: 200 : OK
         // Content Type: text/plain
         response.writeHead(200, {'Content-Type': contentType});	
    	 // response.contentType(request.params.file);
         // Write the content of the file to response body
         //response.write(data.toString());		
         
      }
      // Send the response body 
      response.end(data, 'binary');
   });   
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');
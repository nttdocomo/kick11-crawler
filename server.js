/**
 * @author nttdocomo
 */
var sys = require('sys'), fs = require('fs'), http = require('http'), url = require('url');

var doc_id = 'NOT_FOUND-2d36f401bc4b82c9160e1a4ea936aba3';

http.createServer(function(req, res) {
	var url_parts = url.parse(req.url);

	switch(url_parts.pathname) {
		case '/':
			display_root(url_parts.pathname, req, res);
			break;
		case '/create':
			display_create(url_parts.pathname, req, res);
			break;
		case '/edit':
			sys.puts("display edit");
			break;
		default:
			display_404(url_parts.pathname, req, res);
	}
	return;

	/**
	 * Display the document root
	 **/
	function display_root(url, req, res) {
		res.writeHead(200, {
			'Content-Type' : 'text/html'
		});
		res.end('html');
	}

	/**
	 * Display the list creat page
	 **/
	function display_create(url, req, res) {
		res.writeHead(200, {
			'Content-Type' : 'text/html'
		});
		res.end('html');
	}

	/**
	 * Display the 404 page for content that can't be found
	 **/
	function display_404(url, req, res) {
		res.writeHead(404, {
			'Content-Type' : 'text/html'
		});
		res.write("<h1>404 Not Found</h1>");
		res.end("<p>The page you were looking for: " + url + " can not be found");
	}

}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
//To run the server, put the code into a file example.js and execute it with the node program from the command line:

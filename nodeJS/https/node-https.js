var https = require('https'),
	fs = require("fs");

var options = {
	key: fs.readFileSync('./privatekey.pem'),
	cert: fs.readFileSync('./certificate.pem')
};

// http://blog.fens.me/nodejs-https-server/
https.createServer(options, function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.setHeader("X-Powered-By", ' 3.2.1');
	res.end('hello https!')
}).listen(3011, function() {
	console.log('Https server listening on port ' + 3011);
});
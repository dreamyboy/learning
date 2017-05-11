var https = require('https'),
	fs = require("fs"),
	http2 = require('http2'); //http2不是node自带的全局模块，需要安装node-http2模块，npm install http2

// http://blog.fens.me/nodejs-https-server/
var options = {
	key: fs.readFileSync('./privatekey.pem'),
	cert: fs.readFileSync('./certificate.pem'),
	NPNProtocols: ['h2', 'http 1.1', 'http 1.0'],
	passphrase: '1234'
};
// console.log(http2)
http2.createServer(options, function(request, response) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	response.setHeader("X-Powered-By", ' 3.2.1');
	response.end('Hello http2!');
}).listen(8089, function() {
	console.log('Https server listening on port ' + 8089);
});
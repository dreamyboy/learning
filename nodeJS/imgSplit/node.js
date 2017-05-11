var http = require('http');
var fs = require('fs');
var url = require('url');
var port = 8087
http.createServer(function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.setHeader("X-Powered-By", ' 3.2.1');
	var pathname = url.parse(req.url).pathname;
	var ext = pathname.match(/(\.[^.]+|)$/)[0]; //取得后缀名
	console.log(req.url)
	switch (ext) {
		case '.css':
		case '.js':
			fs.readFile('./' + req.url, 'utf-8', function(err, data) { //读取内容
				if (err) throw err;
				// console.log(data)
				res.writeHead(200, {
					"Content-Type": {
						".css": "text/css",
						".js": "application/javascript"
					}[ext]
				});
				res.write(data);
				res.end();
			});
			break;
		case '.json':
			fs.readFile('./' + req.url, 'utf-8', function(err, data) { //读取内容
				if (err) throw err;
				// console.log(data)
				res.writeHead(200, {
					"Content-Type": "application/json"
				});
				res.write(data);
				res.end();
			});
			break;
		case '.png':
		case '.jpg':
			//图片形式不能utf-8
			fs.readFile('./' + req.url, function(err, data) { //读取内容
				if (err) throw err;
				// console.log(data)
				res.writeHead(200, {
					"Content-Type": "image/png"
				});
				res.write(data);
				res.end();
			});
			break;
		default:
			fs.readFile('./index.html', 'utf-8', function(err, data) { //读取内容
				if (err) throw err;
				// console.log(data)
				res.writeHead(200, {
					"Content-Type": "text/html"
				});
				res.write(data);
				res.end();
			});
	}
}).listen(port, function() {
	console.log((new Date()) + ` Server is listening on port ${port}`);
});
// 如果监听1024以下的端口，比如80端口，需要root权限，在运行node前加上sudo
console.log("Server has started.")

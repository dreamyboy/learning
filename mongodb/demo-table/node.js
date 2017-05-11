// mongoose promise => http://mongoosejs.com/docs/promises.html

var User = require("../mongoose/dbUser.js");
var limit = 8; //每页显示数据的条数
var pagesNum = 0; //总页数

// findAll
function findAll(skip) {
	skip = parseInt(skip) || 0;
	User.find({}).exec().then(data => {
		pagesNum = Math.ceil(data.length / limit);
	}).catch(err => {
		console.dir(err);
	});
	return User.find({}).skip(skip).limit(limit).exec();
}


// find
function find(name) {
	var wherestr = {
			name: new RegExp(name, 'gi')
		}
		// return User.find(wherestr).exec();
	return User.find({}).where(wherestr).exec();
}


// del
function del(_id) {
	var wherestr = {
		'_id': _id
	};
	return User.remove(wherestr).exec();
}


// delAll
function delAll() {
	return User.remove({}).exec();
}


// add
function add(name, age) {
	var user = new User({
		name: name,
		age: age
	});
	return user.save();
}

// update
function update(_id, updateObj) {
	var wherestr = {
		'_id': _id
	};
	return User.update(wherestr, {
		$set: JSON.parse(updateObj)
	}).exec();
}



var http = require('http');
var url = require('url');
var port = 8087;
http.createServer(function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	try {
		var reqUrl = url.parse('http://' + req.headers.host + req.url, true);
	} catch (err) {
		res.writeHead(500, {
			'Content-Type': 'text/plain'
		});
		res.end('err');
		return;
	}
	// console.log(reqUrl)
	switch (reqUrl.pathname) {
		case '/findAll':
			findAll(reqUrl.query.skip).then(function(data) {
				res.end(JSON.stringify({
					limit: limit,
					pages: pagesNum,
					arr: data
				}));
			}).catch(function(err) {
				res.end('err');
			});
			break;
		case '/find':
			find(reqUrl.query.name).then(function(data) {
				res.end(JSON.stringify(data));
			}).catch(function(err) {
				res.end('err');
			});
			break;
		case '/del':
			del(reqUrl.query._id).then(function(data) {
				res.end(JSON.stringify(data));
			}).catch(function(err) {
				res.end('err');
			});
			break;
		case '/add':
			add(reqUrl.query.name, reqUrl.query.age).then(function(data) {
				res.end(JSON.stringify(data));
			}).catch(function(err) {
				res.end('err');
			});
			break;
		case '/update':
			update(reqUrl.query._id, reqUrl.query.updateObj).then(function(data) {
				res.end(JSON.stringify(data));
			}).catch(function(err) {
				res.end('err');
			});
			break;
		case '/delAll':
			delAll().then(function(data) {
				res.end(JSON.stringify(data));
			}).catch(function(err) {
				res.end('err');
			});
			break;
	}
}).listen(port, function() {
	console.log((new Date()) + ` Server is listening on port ${port}`);
});
// 如果监听1024以下的端口，比如80端口，需要root权限，在运行node前加上sudo
console.log("Server has started.")
/**
 * 连接mongodb服务
 * Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具
*/

// 实际中更多是用mongoose，而不是用原生的mongodb

const mongoose = require('mongoose'),
	DB_URL = 'mongodb://localhost:27017/demo';

/**
 * 连接
 */
mongoose.connect(DB_URL);

/**
 * 连接成功
 */
mongoose.connection.on('connected', function() {
	console.log('Mongoose connection open to ' + DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose connection disconnected');
});

module.exports = mongoose;
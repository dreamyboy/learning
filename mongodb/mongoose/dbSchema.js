/**
 * 连接mongodb服务后，定义mongodb里面Users数据库的schema
 */

var mongoose = require('./connectionDB.js');

// 每个数据库都有自己的规定模型，如属性名字，属性数据类型，方法等
// Schema就是定义数据库模型的实现
var UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	age: {
		type: Number
	}
});

// mongoose默认pluralization为true，为true时：
// mongoose.model('user',UserSchema);里面的user会匹配user和Users（不区分大小写，而且会自动加上复数形式）
// 如果要严格匹配表名称，需要设置pluralization为false，为false时：
// mongoose.model('table',UserSchema);只会匹配table

UserSchema.set('pluralization', false);  //开启严格匹配

module.exports = UserSchema;

/**
 * 根据schema定义的模型创建model
 */

var mongoose = require('./connectionDB.js');
var UserSchema = require('./dbSchema.js');

module.exports = mongoose.model('Users', UserSchema);


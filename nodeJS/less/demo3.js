var less = require('less');
var fs = require('fs')
var fileStr = fs.readFileSync('./index2.less', 'utf-8');
// console.log(fileStr)
less.render(fileStr, {
	compress: false
}, function(error, output) {
	console.log(output.css)
})
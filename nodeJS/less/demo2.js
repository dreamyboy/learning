var less = require('less');
var fs = require('fs')
var fileStr = fs.readFileSync('./index.less', 'utf-8');
// console.log(fileStr)
less.render(fileStr, {
	compress: true
}, function(error, output) {
	console.log(output.css)
})
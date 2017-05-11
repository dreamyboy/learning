
var spawn = require('child_process').spawn;

function serialOp(cmd, argvs, dir) {
	var server = spawn(cmd, argvs, {
		cwd: dir,
		stdio: 'inherit'
	});

}



serialOp('./node_modules/.bin/eslint', ['test.js'], './');

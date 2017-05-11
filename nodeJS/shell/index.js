//也可以运用child_process.exec代替spawn
//process.nextTick()



var spawn = require('child_process').spawn;
// child_process.spawn('git', ['clone git@192.168.40.112:web/act.inke.cn.git'])

function serialOp(cmd, argvs, dir, callback) {
	var server = spawn(cmd, argvs, {
		cwd: dir,
		stdio: 'inherit'
	});

	server.on('close', (code) => {
		console.log(cmd + ' ' + argvs.join(' ') + ' process exited with code ' + code);
		callback && callback(true);
	});

	server.on('error', (code, signal) => {
		server.kill(signal);
		console.error('error running the ' + cmd + ' ' + argvs.join(' '));
		callback && callback(false);
	});
}



serialOp('git', ['clone', 'git@192.168.40.112:web/act.inke.cn.git'], './', function(isSuccess) {
	console.log(isSuccess);
});
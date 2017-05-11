var IS_WIN = process.platform.indexOf('win') === 0;
function openBrower(path, callback) {
  var child_process = require('child_process');
  var cmd= '"' + path + '"';
  if (IS_WIN) {
  	console.log(1)
    cmd = 'start "" ' + cmd;
  } else {
    if (process.env['XDG_SESSION_COOKIE'] ||
        process.env['XDG_CONFIG_DIRS'] ||
        process.env['XDG_CURRENT_DESKTOP']) {
    	console.log(11)
      cmd = 'xdg-open ' + cmd;
    } else if (process.env['GNOME_DESKTOP_SESSION_ID']) {
    	console.log(111)
      cmd = 'gnome-open ' + cmd;
    } else {
    	console.log(1111)
      cmd = 'open ' + cmd;
    }
  }
  child_process.exec(cmd, callback);
};
openBrower('http://www.baidu.com',function(){})
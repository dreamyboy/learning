"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。

// 举例来说，ES6在Array对象上新增了Array.from方法。Babel 就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。

// 安装命令如下。

// $ npm install --save babel-polyfill
// 然后，在脚本头部，加入如下一行代码。

// import 'babel-polyfill';
// // 或者
// require('babel-polyfill');
// Babel 默认不转码的 API 非常多，详细清单可以查看babel-plugin-transform-runtime模块的definitions.js文件。


var unique = function unique(arr) {
	return [].concat(_toConsumableArray(new Set(arr)));
};
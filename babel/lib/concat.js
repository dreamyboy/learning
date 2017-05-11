"use strict";

var arr = [1, 2, 3];
var arr2 = [4, 5, 6];

console.log(arr.push.apply(arr, arr2));

var fn = function fn() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	console.log(args);
};
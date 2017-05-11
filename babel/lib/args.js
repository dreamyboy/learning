"use strict";

var fun = function fun() {
	var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

	console.log(m);
};
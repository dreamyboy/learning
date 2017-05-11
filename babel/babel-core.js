// http://es6.ruanyifeng.com/#docs/intro


const core = require('babel-core');
let es6Code = 'let i=20;const j=10; let fun=(i,j)=>{return i+j};fun(i,j)'
let es5Code = core.transform(es6Code, {
	presets: ['es2015']
});

// core.transformFile('filename.js', options, function(err, result) {
// 	result; // => { code, map, ast }
// });

// console.log(core)
console.log(es5Code)

console.log(es5Code.code)
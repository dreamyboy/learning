let [a, b, c] = [1, 2, 3];
console.log(a, b, c)

// demo1
let arr = [1, 2, 3, 4]
let [first, , third] = arr; //注意中间有空的
console.log(first, third);

//
Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

[...'hello']
// [ "h", "e", "l", "l", "o" ]


let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3  //必须需要有length属性
};
Array.from(arrayLike)  // ['a', 'b', 'c']
[...arrayLike]  //报错



//
var a=[1,2,3]
var b=[4,5,6]
console.log(a.push(...b)) //相当于a.concat(b);concat返回数组，push返回length
console.log(a)  //改变了a数组
console.log(b)


//
function test(...arguments){  // 将arguments变成数组
	console.log(arguments instanceof Array)  //true
}
function test2(){  
	// let args = [].slice.call(arguments);
	let args = [...arguments]
	console.log(args instanceof Array)  //true
}
function test3(){
	// Array.from和...的区别查看array.js
	console.log(Array.from(arguments) instanceof Array)  //true
}
// ...必须放在函数参数最后
function push(array, ...items) {
  array.push(...items);
}

function add(x,...y,z,...t) {
  return x + y;
}  //报错

//调用的时候...可以放在中间
function f(v, w, x, y, z) { }
var args = [0, 1];
f(-1, ...args, 2, ...[3]);

// 扩展运算符（spread）是三个点（...），将一个数组转为用逗号分隔的参数序列。
console.log(...[1, 2, 3])
// 1 2 3
console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5
[...document.querySelectorAll('div')]  //trans to array
//[<div>, <div>, <div>]

function add(x, y) {
  return x + y;
}

var numbers = [4, 38];
add(...numbers) // 42



//
let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []


// demo2
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b);

// demo3
function demo() {
	let left = 1,
		right = 2,
		top2 = 3,
		bottom = 4;
	//对象属性名和值名一样的话，可以省略值，如下：
	// return {
	// 	left:left,
	// 	right:right,
	// 	top:top,
	// 	bottom:bottom
	// };
	return {
		left,
		right,
		top2, //注意不能用top，top是关键字标识符，浏览器中console中top代表的是window对象
		bottom
	};
}
// 对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值
let {right,bottom,middle=3,xx}=demo(); //middle指定了默认值
right //2
bottom //4
middle //3
xx  //undefined

//
var {x:y = 3} = {x: 5};  //var {x:y} = {x: 5};
y // 5
var {x:y = 3} = {};
y // 3


//
let { foo: baz } = { foo: "aaa", bar: "bbb" };
baz // "aaa"
foo // error: foo is not defined

//
// 解构赋值允许指定默认值。

let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
// 注意，ES6 内部使用严格相等运算符（===），判断一个位置是否有值。所以，如果一个数组成员不严格等于undefined，默认值是不会生效的。

let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
// 上面代码中，如果一个数组成员是null，默认值就不会生效，因为null不严格等于undefined。

// 如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。

function f() {
  console.log('aaa');
}

let [x = f()] = [1];
// 上面代码中，因为x能取到值，所以函数f根本不会执行。上面的代码其实等价于下面的代码。

let x;
if ([1][0] === undefined) {
  x = f();
} else {
  x = [1][0];
}
// 默认值可以引用解构赋值的其他变量，但该变量必须已经声明。

let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError
// 上面最后一个表达式之所以会报错，是因为x用到默认值y时，y还没有声明。




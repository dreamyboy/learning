// demo1
var test = 1;

function a(isInner) {
	if (isInner) {
		var test = 2;
		return test;
	}
	return test;
}

a(false); //undefined
a(true); //2


// demo2
let test2 = 1;

function b(isInner) {
	if (isInner) {
		let test2 = 2;
		return test2;
	}
	return test2;
}

b(false); //1
b(true); //2
 

// demo3
function c() {
	console.log(a) //undefined
	console.log(b) //报错,let块级作用域，不会申明提前，不能在定义之前使用
	console.log(c) //报错,const也不会申明提前，不能在定义之前使用
	var a = 1;
	let b = 3;
	const c=3;
}


// const声明的常量，也与let一样不可重复声明。
function d() {
	var message = "Hello!";
	let age = 25;

	// 以下两行都会报错
	const message = "Goodbye!";
	const age = 30;
}



//全局变量
// ES6为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从ES6开始，全局变量将逐步与顶层对象的属性脱钩。
var m=1;
window.m //1

len n=2;
window.n //undefined

const x=3;
window.x //undefined


// 对于let和const来说，变量不能重新声明
var a=2;var a=4;
a //4
let b=3;let b=9;
b; //报错
const c=1;const c=4;
c; //报错


//const的作用域与let命令相同：只在声明所在的块级作用域内有效。
if(true){
	let x=1;
	const y=2;
}
console.log(x)//报错
console.log(y)//报错



// const命令和let命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用。
if(true){
	console.log(x); //undefined
	var x=1;

	console.log(y); //报错
	let y=1;

	console.log(z); //报错
	const z=1;
}


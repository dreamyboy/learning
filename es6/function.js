// 箭头函数有几个使用注意点。

// （1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

// （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

// （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替（...arg）。

// （4）不可以使用yield命令，因此箭头函数不能用作Generator函数。

// 由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向

function foo() {
    return () => {
        return () => {
            return () => {
                console.log('id:', this.id);
            };
        };
    };
}

var f = foo.call({
    id: 1
});

var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1
// 上面代码之中，只有一个this，就是函数foo的this，所以t1、t2、t3都输出同样的结果。因为所有的内层函数都是箭头函数，都没有自己的this，它们的this其实都是最外层foo函数的this。




function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello

// 参数变量是默认声明的，所以不能用let或const再次声明。
function foo(x = 5) {
  let x = 1; // error
  const x = 2; // error
}

// 使用参数默认值时，函数不能有同名参数。
function foo(x, x, y = 1) {
  // ...
}
// SyntaxError: Duplicate parameter name not allowed in this context


// ...必须放在函数参数最后
function push(array, ...items) {
  array.push(...items);
}

function add(x,...y,z,...t) {
  return x + y;
}  //报错


// 扩展运算符（spread）是三个点（...），将一个数组转为用逗号分隔的参数序列。
// 替代数组的apply方法
// ES5的写法
Math.max.apply(null, [14, 3, 77])

// ES6的写法
Math.max(...[14, 3, 77])
Math.max.call(null, ...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);


// ES5的写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6的写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1.push(...arr2);



//
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101


// 通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的。
// 所以尽量都把有默认值的参数放到最后
// 例一
function f(x = 1, y) {
  return [x, y];
}

f() // [1, undefined]
f(2) // [2, undefined])
f(, 1) // 报错
f(undefined, 1) // [1, 1]

// 例二
function f(x, y = 5, z) {
  return [x, y, z];
}

f() // [undefined, 5, undefined]
f(1) // [1, 5, undefined]
f(1, ,2) // 报错
f(1, undefined, 2) // [1, 5, 2]
// 上面代码中，有默认值的参数都不是尾参数。这时，无法只省略该参数，而不省略它后面的参数，除非显式输入undefined。

// 如果传入undefined，将触发该参数等于默认值，null则没有这个效果。

function foo(x = 5, y = 6) {
  console.log(x, y);
}

foo(undefined, null)
// 5 null
// 上面代码中，x参数对应undefined，结果触发了默认值，y参数等于null，就没有触发默认值。


var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2


function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // ReferenceError: x is not defined




var x = 1;

function foo(x = x) {
  // ...
}

foo() // ReferenceError: x is not defined
// 上面代码中，参数x = x形成一个单独作用域。实际执行的是let x = x，由于暂时性死区的原因，这行代码会报错”x 未定义“


// 函数的length属性，不包括 rest 参数。
(function(a) {}).length  // 1
(function(...a) {}).length  // 0
(function(a, ...b) {}).length  // 1




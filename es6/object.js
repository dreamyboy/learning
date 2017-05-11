// 属性名和值是一样的话可以简写
var obj = {
	a,
	b,
	c() {
		console.log('test')
	}
}

// 相当于：
var obj = {
	a： a
	b: b
	c: function() {
		console.log('test')
	}
}



// 允许变量和表达式作为属性名
let propKey = 'foo';
let objA = {}

let obj = {
	[propKey]: true,
	['a' + 'bc']: 123,
	['h' + 'ello']() {
		return 'hi';
	},
	objA
};
// {foo: true, abc: 123, hello: function}


//
const keyA = {
	a: 1
};
const keyB = {
	b: 2
};

const myObject = {
	[keyA]: 'valueA',
	[keyB]: 'valueB'
};

myObject // Object {[object Object]: "valueB"}
// 上面代码中，[keyA]和[keyB]得到的都是[object Object]，所以[keyB]会把[keyA]覆盖掉，而myObject最后只有一个[object Object]属性。


// Object.is
Object.is('foo', 'foo')
// true
Object.is({}, {})
// false
+0 === -0 //true
NaN === NaN // false
Infinity===Infinity // true

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
Object.is(Infinity,Infinity) // true



// Object.assign()
var target = { a: 1 };

var source1 = { b: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}

//如果只有一个参数，Object.assign会直接返回该参数
var obj = {a: 1};
Object.assign(obj) === obj // true

// 注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。
var target = { a: 1, b: 1 };

var source1 = { b: 2, c: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}

// Object.assign拷贝的属性是有限制的，只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（enumerable: false）
Object.assign({b: 'c'},
  Object.defineProperty({}, 'invisible', {
    enumerable: false,
    value: 'hello'
  })
)
// { b: 'c' }



































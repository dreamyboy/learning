// Array.from方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括ES6新增的数据结构Set和Map）。
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3  //必须需要有length属性
};
Array.from(arrayLike)  // ['a', 'b', 'c']
[...arrayLike]  //报错


Array.from({ length: 3 });
// [ undefined, undefined, undefined ]

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).forEach(function (p) {
  console.log(p);
});

// arguments对象
function foo() {
  var args = Array.from(arguments);
  // ...
}

// Array.from方法和扩展运算符（...）会将数组的空位，转为undefined
Array.from(['a',,'b'])  //["a", undefined, "b"]
[...['a',,'b']]  // [ "a", undefined, "b" ]


Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

[...'hello']
// [ "h", "e", "l", "l", "o" ]

let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']

Array.from({ length: 3 });
// [ undefined, undefined, undefined ]


// 扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。Array.from方法则是还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有length属性。因此，任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。

// Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
Array.from([1, 2, 3], x => x * x)  // 1,4,9












// Array.of方法用于将一组值，转换为数组。


Array.of() // []
Array.of(NaN) // [NaN]
Array.of(null) // [null]
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
Array.of(3, 11, 8) // [3,11,8]
Array.of(3, 11, 8).length  // 3
Array.of((function(){return 'a'})())  // ["a"]
Array.of((function(){return [1,2,3].fill(9)})()) // [[9,9,9]]二维数组








// 数组实例的copyWithin方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

// Array.prototype.copyWithin(target, start = 0, end = this.length)
// 它接受三个参数。

// target（必需）：从该位置开始替换数据。
// start（可选）：从该位置开始读取数据，默认为0。如果为负值，表示倒数。
// end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
// 这三个参数都应该是数值，如果不是，会自动转为数值。

[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]
// 上面代码表示将从3号位直到数组结束的成员（4和5），复制到从0号位开始的位置，结果覆盖了原来的1和2。

// 下面是更多例子。

// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]

// 将3号位复制到0号位
[].copyWithin.call({length: 5, 3: 1}, 0, 3)
// {0: 1, 3: 1, length: 5}

// 将2号位到数组结束，复制到0号位
var i32a = new Int32Array([1, 2, 3, 4, 5]);
i32a.copyWithin(0, 2);
// Int32Array [3, 4, 5, 4, 5]

// 对于没有部署TypedArray的copyWithin方法的平台
// 需要采用下面的写法
[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]






// 数组实例的find()和findIndex()

// 数组实例的find方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。

[1, 4, -5, 10].find((n) => n < 0)
// -5
// 上面代码找出数组中第一个小于0的成员。

[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10  这里只返回10，不返回15，因为find方法是找出第一个符合条件，不是所有符合条件的
// 上面代码中，find方法的回调函数可以接受三个参数，依次为当前的值、当前的位置和原数组。
var arr = [{
	"a": 1,
	"b": 1
}, {
	"a": 2,
	"b": 2
}, {
	"a": 3,
	"b": 3
}];
arr.find((val, index, arrOrigin) => {
	return val.a >= 2
})  // {"a": 2,"b": 2}


// 数组实例的findIndex方法的用法与find方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。

[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Object.is(NaN, y))
// 0
// 上面代码中，indexOf方法无法识别数组的NaN成员，但是findIndex方法可以借助Object.is方法做到。










// fill方法使用给定值，填充一个数组。改变的是原数组

['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]
// fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']

var arr =['a', 'b', 'c'];
var newArr = arr.fill(7);
console.log(arr)
console.log(newArr)



// 该方法的第二个参数表示搜索的起始位置
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, NaN].includes(NaN); // true
[NaN].indexOf(NaN)  //-1

[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true

const contains = (() =>
  Array.prototype.includes
    ? (arr, value) => arr.includes(value)
    : (arr, value) => arr.some(el => el === value)
)();
contains(["foo", "bar"], "baz"); // => false





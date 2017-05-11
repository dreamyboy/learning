'abc'.charAt(0) // "a"
'abc'.at(0) // "a"


var s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
// 这三个方法都支持第二个参数，表示开始搜索的位置。

var s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
// 上面代码表示，使用第二个参数n时，endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。




// repeat方法返回一个新字符串，表示将原字符串重复n次。

'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""
// 参数如果是小数，会被取整。

'na'.repeat(2.9) // "nana"
// 如果repeat的参数是负数或者Infinity，会报错。

'na'.repeat(Infinity)
// RangeError
'na'.repeat(-1)
// RangeError

// 但是，如果参数是0到-1之间的小数，则等同于0，这是因为会先进行取整运算。0到-1之间的小数，取整以后等于-0，repeat视同为0。
'na'.repeat(-0.9) // ""

// 参数NaN等同于0。
'na'.repeat(NaN) // ""
// 如果repeat的参数是字符串，则会先转换成数字。

'na'.repeat('na') // ""
'na'.repeat('3') // "nanana"




// ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'



String.raw({ raw: 'test' }, 0, 1, 2);
// 't0e1s2t'




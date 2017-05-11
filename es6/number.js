// 如果要将0b(二进制)和0o（八进制）前缀的字符串数值转为十进制，要使用Number方法。

Number('0b111')  // 7
Number('0o10')  // 8

// 十进制转别的
7..toString(2);
7..toString(8);
7..toString(16);  



Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0

~~4.1 //4
~~4.9 //4
~~-4.1 //-4
~~-4.9 //-4


// Math.sign方法用来判断一个数到底是正数、负数、还是零

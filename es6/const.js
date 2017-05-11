// demo1
const a = 1;
console.log(a);
a = 2;
console.log(a);


// demo2
const b = {
	c: 1
}
console.log(b.c)
b.c = 3;
console.log(b.c)


//demo3
// const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。
const x;
x=3; //会报错


console.log(y); //报错，let和const都不能申明提前，不像var
const y=1;
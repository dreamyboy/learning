// catch 错误
// 申明提前（预编译），let和function编译阶段就报错了，这时还没到计算的（try，catch）时候，所以catch不到错误，
// 而new Function和eval不会申明提前，而是直接计算（try，catch），这时的错误都会被catch住

try {
	let2 b = 1
} catch (e) {
	console.log(9)
}


try {
	function a() {
		let2 b = 1
	}
} catch (e) {
	console.log(9)
}


try {
	new Function('let2 b=1')
} catch (e) {
	console.log(9)
}


try {
	eval('let2 b=1')
} catch (e) {
	console.log(9)
}











// http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651552002&idx=2&sn=05342c47de9108c41868a403583d5191&chksm=8025aec3b75227d528b48558b80e2212c665f170bbc4330a5251d976e98779c24777ca01d962&mpshare=1&scene=23&srcid=0326XAKo8HJHxORtz9eREoLM#rd
function add(){

}
console.log(add)  // 会调用函数默认的valueOf方法
console.log(add.valueOf())
// 两个console返回的都是函数本身



function add(x) {
	function addFake(y) {
		x = x + y;
		return addFake;  //每次计算完X的值后，又返回此函数供后面调用
	};
	// addFake.toString = addFake.valueOf = function() {
	// 	return x;
	// };
	return addFake;
}
// 第一次调用add(1)返回的是addFake函数，然后第二次调用add(1)(2)相当于执行了addFake，将x变成了x+y，执行完后又返回这个函数，第三次调用之前，X变成了3，而且返回addFake函数供第三次调用
// 直到最后，X的值已经变成了相加的值，而且返回了addFake函数，如果没有重新定义addFake函数的toString和valueOf方法，会调用此函数的默认的toString和valueOf方法，
// 而函数的默认的toString和valueOf方法返回的是函数定义的本身代码，所以这里我们重新定义addFake函数的toString和valueOf方法，让其返回X的值



function add(x) {
	//由于要一个数记住每次的计算值，所以使用了闭包，在addFake中记住了x的值，第一次调用add(),初始化了addFake，并将x保存在addFake的作用链中，然后返回addFake  
	//保证了第二次调用的是addFake函数，后面的计算都是在条用addFake, 因为addFake也是返回的自己，保证了第二次之后的调用也是调用addFake，而在addFake中将传入的  
	//参数与保存在作用链中x相加并付给x，这样就保证了计算；但是在计算完成后还是返回了addFake这个函数，这样就获取不到计算的结果了，我们需要的结果是一个计算的数字  
	//那么怎么办呢，首先要知道JavaScript中，打印和相加计算，会分别调用toString或valueOf函数，所以我们重写addFake的toString和valueOf方法，返回x的值  
	function addFake(y) {
		x = x + y;
		return addFake;
	};
	addFake.toString = addFake.valueOf = function() {
		return x;
	};
	return addFake;  //add(1)时候，返回的是这里的addFake函数，如果后面没有继续对addFake的调用，而函数会默认调用其valueOf和toString方法，这里重写了valueOf和toString方法，所以返回了1
}
add(1)(2)(3)(4)
// 可以看到，这里其实有一种循环。只有最后一次调用才真正调用到 valueOf，而之前的操作都是相加参数，并且赋值给X，递归调用本身，由于最后一次调用返回的是一个 addFake 函数，所以最终调用了函数的 addFake.valueOf，并且返回了X











class Person {
	constructor(name) {
		this.name = name;
	}
	say() {
		console.log('super:' + this.name);
	}
}



class Xiaoming extends Person {
	say() {
		super.say();
		console.log('hello:' + this.name);
	}
}

let x = new Xiaoming('test');
x.say()

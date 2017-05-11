class Person {
	constructor(name) {
		this.name = name;
	}
	say() {
		console.log('hello:' + this.name);
	}
}

let person=new Person('xiaoming');
person.say();
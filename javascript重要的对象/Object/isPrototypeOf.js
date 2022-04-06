class Dog {}

var dog = new Dog();

console.log(Dog.prototype.isPrototypeOf(dog)); // true

var cat = {};

cat.__proto__ = dog;

console.log(dog.isPrototypeOf(cat)); // true
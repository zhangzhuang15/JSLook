/*
  Reflect只有静态方法，作用和Object类似
*/

function Dog(name, age){
    console.log("Dog");
    console.log(new.target);
    this.name = name;
    this.age = age;
}

Dog.prototype.tell = function() { console.log("dog dog "); }

function Cat(name, age){
    console.log("Cat");
    console.log(new.target);
    this.name = name;
    this.age = age;
}

Cat.prototype.tell = function() { console.log("cat cat"); }

var dog = {
    name: 'Jucy',
    age:3,
    food: 'sausage pie',
    children: ["Annie", "Wazz"]
};

var obj = {};

console.log("dog has 'name' ?");
console.log( Reflect.has(dog, 'name') );

console.log();

console.log("dog keys: ");
var keys = Reflect.ownKeys(dog);
for(let key of keys){
    console.log(key);
}

console.log();



Reflect.set(dog, 'color', 'black');        // dog['color'] = 'black'
console.log('dog color: ', dog['color']);
Reflect.set(dog, 'color', 'grey', obj);    // obj['color'] = 'grey'
console.log('obj color: ', obj['color']);


console.log();



console.log("dog name: ", Reflect.get(dog, 'name') );



console.log();




// p 的构造函数使用的是 Dog, 但是 p 是Cat的实例, 不是 Dog的实例
// Reflect.construct相当于new
var p = Reflect.construct(Dog, ["July", 2], Cat);
console.log(p instanceof Dog);  // false
console.log(p instanceof Cat);  // true
p.tell();  // cat cat


console.log(); 


// p 的构造函数用的是 Dog, 也是Dog的实例
p = Reflect.construct(Dog, ['Pipi', 1]);
console.log(p instanceof Dog);  // true
console.log(p instanceof Cat);  // true
p.tell(); //dog dog
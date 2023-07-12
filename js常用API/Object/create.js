class Dog {
    tell() {
        console.log("dog dog");
    }
}

var dog = Object.create(Dog.prototype);  // dog.__proto__ === Dog.prototype
dog.tell();

/**
 *  Object.create(M) 做了什么事情？
 *  1、 创建一个空对象 m = {}
 *  2、 设置空对象的原型链 m.__proto__ = M
 *  3、 返回对象 m
 */


var cat = Object.create(dog); // cat.__proto__ === dog   
cat.tell();    // cat 本身没有 tell 属性，
               // 顺着 cat.__proto__， 查找 dog 有没有 tell 属性，
               // dog也没有tell属性，顺着 dog.__proto__ 查找 Dog.prototype有没有tell属性，
               // 嗯，Dog.prototype有tell属性，调用！
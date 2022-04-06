// 箭头函数的难点在于对 箭头函数中 this 的理解

// 没有加 var 定义的变量，作为 global 对象的属性
value = "Jack";

// 箭头函数没有自己的this，它的this用的是上下文的this，这里没有上下文，this将指向 {}。
// 在一个普通函数中定义func，那么上下文就是指普通函数。
var func = (key) => {
    return this[key];
}

var name = func("value");
console.log("name: ", name); // undefined


/////////////////////////////////////////////////////

function tell(key) {
    return func(key);
}

name = tell("value");
console.log("name: ", name); // undefined

/////////////////////////////////////////////////////

var p = { 
    value: "Peter",
    tell: function(key) { 
        return func(key); 
    } 
};

name = p.tell("value");
console.log("name: ", name); // undefined

////////////////////////////////////////////////////

function tellme(key) {
    var fn = (key) => this[key];
    // fn的上下文指的是 tellme函数，this就是tellme函数的this；
    // 普通函数如果作为一个对象的属性，那么它的this就是该对象；
    // 否则this是global对象；
    // 因此 this === global
    return fn(key);
}
name = tellme("value");
console.log("name: ", name); // "Jack"

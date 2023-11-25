let a = b = 10;

(function(){
    let a = b = 20
})()

console.log(a, b)

// 10 20



// let a = b = 10 等效于 let a; b = 10; a = b

// let a = b = 20 等效于 let a; b = 20; a = b
// a 是函数内部变量，不会影响到外部的变量 a
// b 是全局变量
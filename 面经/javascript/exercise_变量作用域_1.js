name = 'jack'
var _age = 14
const sex  = 99     // 报错，声明时就要给出赋值
let height = 2

tell() // function tell 会提升到开头，此处可以放心调用

function tell() {
    console.log(kName) // kName 的声明会提升，提升到tell函数声明之前，
                       // 因为只是声明提升，并没有定义，所以打印 undefined
    console.log(global.name)
   
    console.log(name) // 报错
    class name {}    // let const class 不会变量提升
    console.log(name)

    console.log(_age)
    console.log(sex)
    console.log(height)
}

var kName = "peter"





// 好好比对一下 name 、 _age、heihgt 的差异。
// name没有用 var 声明，在函数内直接报错，而不是作为 undefined 理解。
// _age 用 var 声明，可以在函数内被访问。
// height 用 let 声明，可以在函数内被访问。

// name是全局变量，nodejs环境下，出现在 global 对象上；
// _age sex height tell 都是局部变量；

// var let const 声明的变量都是局部变量；
// var 是函数作用域，存在声明提升；
// let const 是块级作用域，不存在声明提升；
// 用function声明的函数也是局部变量，块级作用域；
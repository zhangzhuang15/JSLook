name = 'jack'
var _age = 14
const sex             // 报错，声明时就要给出赋值
let height = 2
function tell() {
    console.log(global.name)

    console.log(name) // 报错
    class name {}    // let const class 不会变量提升
    console.log(name)

    console.log(_age)
    console.log(sex)
    console.log(height)
}


tell()


// 好好比对一下 name 、 _age、heihgt 的差异。
// name没有用 var 声明，在函数内直接报错，而不是作为 undefined 理解。
// _age 用 var 声明，可以在函数内被访问。
// height 用 let 声明，可以在函数内被访问。
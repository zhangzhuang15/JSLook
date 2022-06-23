var a = 1
function a() {}
console.log(a)


var b
function b(){}
console.log(b)


// 函数和变量同名，函数声明优先提升，
// 关于 a 等效于
//      function a(){}
//      var a
//      a = 1
//      console.log(a)

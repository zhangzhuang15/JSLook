var i = 1

function b() {
    console.log(i)      // 这里定义，确定下来 i 就是第1行的 i
}

function a() {
    var i = 2
    b()
}

a()


// 函数内的变量作用域在函数定义时确定，不是在函数执行中确定，
// 函数内如果没有某个变量的声明，就到上层作用域寻找。
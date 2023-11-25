var a = 0, b = 0;

function A(a) {
    A = function(b) {
        console.log(a + b++);
    }

    console.log(a++);
}

A(1);

A(2);

// 打印结果是什么？

// 考察局部作用域、全局作用域、闭包

// function A(a) {} 是函数A的声明，而A本身就是局部变量，依然可以
// 被重新赋值
function hello(a) {
    if (a > 4) {
        function ok() {
            console.log('ok')
        }
    }

    ok();
}

hello(3)

// 函数是块级作用域，因此 ok 只能在 a > 4 的时候被访问到
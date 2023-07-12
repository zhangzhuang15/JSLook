var callback

callback = () => {
    this.speak()      // 箭头函数内部的this，在箭头函数被定义的时候就已经确定了，
                      // 此时因为缺少函数环境，因此 this === undefined
}

function definite() {
    callback = () => {
        this.speak()
    }
}


global.speak = function() {
    console.log("hello")
}


function test() {
    callback()       // 在这里调用，test()函数体中，this === global， global的speak方法已经定义出来了，
                    //  但是此处的调用却发生错误，这就证明 callback内部的this并没有随着外部函数环境而改变，
                    // 也就是说在箭头函数定义的时候，this就已经确立了
}

// definite()      // 打开此处的注释，就可以运行正常，
                   // 因为在definite函数环境下，callback重新被定义，callback内部的 this === global

test()
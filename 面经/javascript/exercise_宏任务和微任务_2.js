async function hello() {
    console.log(1)
    return 1
}

async function say() {
    console.log(2)
    await hello()
    console.log(3)
}

async function speak() {
    console.log(4)
    hello()
    console.log(5)
}


say()

speak()



// 分析:
// 执行 say(), 打印 2，
// 遇到 await hello(), 
// 等效于 Promise.resolve(hello()).then(_ => { console.log(3)})
// 因此接着打印 1， 将 then 加入到微任务队列；
// 之后执行 speak， 打印 4 1 5；
// 取出 微任务执行，打印 3；

// 2
// 1
// 4
// 1
// 5
// 3
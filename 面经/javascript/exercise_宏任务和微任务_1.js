setTimeout( () => console.log("1"), 0)

setTimeout( () => new Promise( resolve => {
    console.log("2")
    resolve(3)
})
.then(data => console.log(data))
, 0)

console.log(4)



// 分析：
// 第一行代码宏任务，加入宏任务队列；
// 第三行代码宏任务，加入宏任务队列；
// 第10行代码执行，打印 4；
// 微任务队列为空，
// 取出第一个宏任务，打印 1；
// 微任务队列为空，
// 取出第二个宏任务，打印 2， 将微任务then() 加入到微任务队列；
// 取出微任务执行，打印 3；

// 4
// 1
// 2
// 3
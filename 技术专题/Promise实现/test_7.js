const { MyPromise, flushQueue } = require("./mypromise")

// resolve 一个 Pending Promise

console.log("Promise Perform:")
Promise
  .resolve(new Promise((resolve, reject) => {
    setTimeout(() => resolve("hello"), 200)
  }))
  .then(v => console.log(v))
Promise.resolve().then(() => console.log(1)).then(() => console.log(2)).then(() => console.log(3))

setTimeout(() => {
    console.log()
    console.log("MyPromise Perform: ")
    MyPromise
      .resolve(new Promise((resolve, reject) => {
        // 我们使用js代码模拟队列，涉及到事件循环调度器
        // 的时候，我们的队列无法模拟，因此，在下文 flushQueue
        // 的时候，是同步执行，像此处定义的异步执行将无法处理
        setTimeout(() => resolve("hello"), 200)
      }))
      .then(v => console.log(v))
    MyPromise.resolve().then(() => console.log(1)).then(() => console.log(2)).then(() => console.log(3))
    flushQueue()
}, 1000)
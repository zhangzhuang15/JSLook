const { MyPromise, flushQueue } = require("./mypromise");

// then 中返回 thenable

console.log("Promise Perform:")
Promise
  .resolve()
  .then(() => ({ then: (value) => value }))
  .then(v => console.log(v))
Promise
  .resolve()
  .then(() => console.log(1))
  .then(() => console.log(2))
  .then(() => console.log(3))


setTimeout(() => {
    console.log()
    console.log("MyPromise Perform: ")
    MyPromise
      .resolve()
      .then(() => ({ then: (value) => value }))
      .then(v => console.log(v))
    MyPromise
      .resolve()
      .then(() => console.log(1))
      .then(() => console.log(2))
      .then(() => console.log(3))

    flushQueue()
}, 100)


const { MyPromise, flushQueue } = require("./mypromise")

// then 中返回 Fulfilled Promise

console.log("Promise Perform:")
Promise
  .resolve()
  .then(() => Promise.resolve(10))
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
      .then(() => MyPromise.resolve(10))
      .then(v => console.log(v))
    MyPromise
      .resolve()
      .then(() => console.log(1))
      .then(() => console.log(2))
      .then(() => console.log(3))

    flushQueue()
}, 100)
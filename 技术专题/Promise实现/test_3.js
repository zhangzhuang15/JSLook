const { MyPromise, flushQueue } = require("./mypromise")

// then 返回一个 Rejected Promise

console.log("Promise Perform:")
Promise
  .resolve()
  .then(() => Promise.reject("hello"))
  .catch(v => console.log(v))
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
      .then(() => MyPromise.reject("hello"))
      .catch(v => console.log(v))
    MyPromise
      .resolve()
      .then(() => console.log(1))
      .then(() => console.log(2))
      .then(() => console.log(3))

    flushQueue()
}, 100)
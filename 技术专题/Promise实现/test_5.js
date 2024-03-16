const { MyPromise, flushQueue } = require("./mypromise")

// resolve 一个 thenable

console.log("Promise Perform:")
Promise
  .resolve({ 
    then: (onFulfilled) => { 
        console.log(0)
        onFulfilled(10)
    }
  })
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
      .resolve({
        then: (onFulfilled) => { 
            console.log(0)
            onFulfilled(10)
        }
      })
      .then(v => console.log(v))
    MyPromise
      .resolve()
      .then(() => console.log(1))
      .then(() => console.log(2))
      .then(() => console.log(3))

    flushQueue()


}, 100)
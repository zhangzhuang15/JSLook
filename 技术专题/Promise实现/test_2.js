const MyPromise = require("./mypromise");

MyPromise
    .resolve()
    .then(() => MyPromise.reject("hello"))
    .catch(v => console.log("error: ", v))

MyPromise
    .resolve()
    .then(() => console.log(1))
    .then(() => console.log(2))
    .then(() => console.log(3))
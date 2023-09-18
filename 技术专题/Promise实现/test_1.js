const MyPromise = require("./mypromise");

MyPromise.resolve(MyPromise.resolve(5)).then(val => console.log(val));

MyPromise.resolve().then(() => MyPromise.resolve(10)).then(val => console.log(val));

MyPromise
    .resolve()
    .then(() => console.log(1))
    .then(() => console.log(2))
    .then(() => console.log(3))
Promise
    .resolve()
    .then(() => Promise.reject("hello"))
    .catch(v => console.log("error: ", v))

Promise
    .resolve()
    .then(() => console.log(1))
    .then(() => console.log(2))
    .then(() => console.log(3))

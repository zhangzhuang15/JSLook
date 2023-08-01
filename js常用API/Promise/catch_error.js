// won't interrupt
Promise.resolve(new Error());

console.log("running regularly");

// catch outside
try {
    Promise.resolve((() => { throw new Error("hello")})());
} catch (err) {
    console.log("err: ", err.message);
}

// cannot catch error!
// Promise.resolve((() => { throw new Error("world")})()).catch(err => console.log("err: ", err.message))

// new Error will be considered as a regular js data, jump into then callback
Promise.resolve((() => { return new Error("world")})()).then(v => console.log("value: ", v.message)).catch(err => console.log("err: ", err.message))

// new Error will be considered as a regular js data too
Promise.resolve().then(() => new Error("Sorry"))

// catch error in catch callback!
// you cannot catch it outside!
Promise.resolve().then(() => { throw new Error("OK")}).catch(err => console.log("error error: ", err.message))
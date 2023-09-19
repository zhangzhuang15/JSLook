// new Error will be considered as a regular js data, jump into then callback
Promise.resolve((() => { return new Error("world")})()).then(v => console.log("value: ", v.message)).catch(err => console.log("err: ", err.message))

// new Error will be considered as a regular js data too
Promise.resolve().then(() => new Error("Sorry"))
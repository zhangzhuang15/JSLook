// catch error in catch callback!
// you cannot catch it outside!
Promise.resolve().then(() => { throw new Error("OK")}).catch(err => console.log("error error: ", err.message))

// you can also catch error like this
let p = Promise.resolve().then(() => { throw new Error("Shit")});
p.catch((err) => console.log("Shit error"));
// won't interrupt
Promise.resolve(new Error());

// catch outside
try {
    Promise.resolve((() => { throw new Error("hello")})());
} catch (err) {
    console.log("err: ", err.message);
}

// cannot catch error!
// Promise.resolve((() => { throw new Error("world")})()).catch(err => console.log("err: ", err.message))

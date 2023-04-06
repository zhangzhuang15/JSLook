async function hello() {
    return "hello"
}

hello().then((r) => console.log(r))
Promise.resolve().then(() => console.log(1)).then(() => console.log(2))

// hello() equal to Promise.resolve("hello")
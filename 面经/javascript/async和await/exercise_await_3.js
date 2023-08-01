async function hello() {
    console.log(1)
    await 6
    console.log(2)
}

hello().then(() => console.log(3))
Promise.resolve().then(_ => console.log(4)).then(_ => console.log(5))


// await 6 等效于：
// Promise.resolve(6).then(_ => console.log(2))
async function hello() {
    console.log(1)
    return "hello"
}

async function say() {
    console.log(2)
    const v = await hello()
    console.log(v)
}

say().then(() => console.log(3))
Promise.resolve().then(() => console.log(4)).then(() => console.log(5))

// await hello() 等效于：
// Promise.resolve((() => { console.log(1); return "hello";})())
//
// 进一步，say等效于：
// function say() {
//   console.log(2);
//   return Promise.resolve((() => { console.log(1); return "hello";})()).then(v => console.log(v))
// }
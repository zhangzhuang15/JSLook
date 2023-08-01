async function hello() {
    console.log(1)
    return {
        then: r => r("hello")
    }
}


async function say() {
    console.log(2)
    const v = await hello()
    console.log(v)
}

say().then(() => console.log(6))
Promise.resolve().then(() => console.log(4)).then(() => console.log(5))

// await hello() 等效于：
// const value = hello()
// const v = await value
//
// 进一步，say() 等效于：
// function say() {
//        console.log(2);
//        console.log(1);
//        return Promise.resolve().then(() => "hello").then(v => console.log(v))
// }
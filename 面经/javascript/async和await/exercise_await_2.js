async function hello() {
    console.log(1)

    await new Promise(resolve => resolve('hello'))

    console.log(2)
}

hello()

Promise.resolve().then(() => console.log(3)).then(() => console.log(4))


// await part equals to:
// Promise.resolve("hello").then(() => console.log(2))
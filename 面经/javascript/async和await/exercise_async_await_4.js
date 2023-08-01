async function hello() {
    console.log(1)
    return Promise.resolve("hello")
}

async function say() {
    console.log(2)
    const v = await hello()
    console.log(v)
}

say().then(() => console.log(3))
Promise.resolve().then(_ => console.log(4)).then(_ => console.log(5))

// 和 exercise_async_await_2.js情况一样
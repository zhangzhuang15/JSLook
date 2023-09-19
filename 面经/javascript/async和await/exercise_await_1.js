async function hello() {
    console.log(1)

    await {
        then: (r) => r()
    }

    console.log(2)
}

hello()

Promise.resolve().then(() => console.log(3)).then(() => console.log(4))

// await part equals to:
// Promise.resolve().then(() => null).then(() => console.log(2))
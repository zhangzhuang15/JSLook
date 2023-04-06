async function hello() {
    return {
        then: (r) => r("hello")
    }
}

hello().then((value) => console.log(value))
Promise.resolve().then(() => console.log(2)).then(() => console.log(3))

// hello() equals to Promise.resolve().then(() => "hello")
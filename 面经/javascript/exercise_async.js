function sayHello() {
    return new Promise((resolve) => {
        setTimeout( () => {
            console.log('hello')
            resolve(1000)
        }, 2000)
    })
}


async function test() {
    await sayHello()
    console.log('why')
}

async function main() {
    await test().then(item => console.log(item))
    console.log('not')
}

main()
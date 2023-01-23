function run() {
    return new Promise(resolve => 
        setTimeout(() => {
            console.log("1")
            resolve(10)
        }, 300)
    )
}

//  task Task 等效

function task() {
    return new Promise(resolve => {
        run().then(result => resolve(5))
    })
}

async function Task() {
    const result = await run()
    return 5
}

console.log(task())

Promise.all([task(), task()]).then(value => console.log("value: ", value))
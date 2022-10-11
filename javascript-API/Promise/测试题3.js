const promise = Promise.reject("Error")

async function Do() {
    try {
        await promise
    }
    catch(e) {
        console.log("err is ", e)
    }
}

Do()


// 除了使用 promise.catch外，还可以使用上述方法步骤错误
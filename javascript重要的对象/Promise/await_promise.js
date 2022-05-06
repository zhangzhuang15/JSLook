function ab() {
    return Promise.resolve(14)
}

function cd() {
    return Promise.reject("err message")
}

async function main() {
    let value = await ab()
    console.log("value: ", value)

    // 以await的形式处理 Promise，如果Promise发生reject，
    // 且没有指定 catch 方法，错误通过 try ... catch 捕捉。
    try {
        value = await cd()
    } catch (err) {
        console.log('err: ', err)
    }

    console.log("value: ", value)
}

main()
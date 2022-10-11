async function getList() {
    new Promise((resolve, reject) => {
        reject('what the fuck error!')
    })
}

async function main() {
    try {
        await getList().catch(err => console.log("1"))
    }
    catch(e) {
        console.log("2")
    }
}

main()


// 问题： 第 9 行抛出的错误能 catch到么？
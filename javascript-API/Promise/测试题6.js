async function b() {
   
}

async function a() {
    const t = await b()
    console.log('world')
}

async function main() {
    await a()
    console.log('hello')
}

main()


// 输出顺序？
// 等效代码？

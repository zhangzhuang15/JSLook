async function run2s() {
    // 比对 await 去掉与否带来的输出变化
    await setTimeout( () => console.log('2s'), 2000)
}

async function immediate() {
    return 1
}

async function novalue() {
    await 'joke'
}


function main() {
    
    // 什么都没return，但可以做一个 Promise处理
    run2s().then(data => console.log('run2s: ', data) )   // undefined

    // 返回数字1，仍旧作为 Promise 来处理
    immediate().then(data =>  console.log('immediate: ', data) )   // 1

    // 什么也没返回，仍旧作为一个 Promise 处理
    novalue().then(data => console.log('novalue: ', data))  // undefined
}

main() 
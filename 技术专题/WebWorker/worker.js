onmessage = e => {
    const { start, end } = e.data
    let result = 0
    for(let i = start; i < end; i++) {
        result += i
    }
    // 5s延迟返回，模拟耗时数据计算
    setTimeout( _ => {
        postMessage({ result })
    }, 5 * 1000)
}
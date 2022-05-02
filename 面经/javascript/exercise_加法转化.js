console.log(1 + NaN)

console.log("1" + 3)

console.log(1 + undefined)

console.log(1 + null)

console.log(1 + {})

console.log(1 + [])

console.log([] + {})


// 有一个是字符串，就把另外一个转化为字符串，二者相加；
// 如果一个是对象，就调用对象的valueOf转化为数字，如果valueOf无法得到数字，就调用 toString转化为字符串；
// 其他情况下，两个操作数都被转化为数字

// Number(null) === 0
// Number(undefined) NaN
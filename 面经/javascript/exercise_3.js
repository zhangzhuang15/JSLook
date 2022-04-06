let i = 0
i = i + { valueOf() { return 10 }}
// i === 10 ?
console.log(i == 10)

let j = 0
new Array(10).forEach( () => j++ )
// j == 10?
console.log(j == 10)




// [1, 2, 3].forEach( callback )    callback 执行三次
// [1, undefined].forEach( callback ) callback 执行一次

// { valueOf() {} } 是一个匿名对象，和数字相加的时候，会默认调用
// valueOf方法转换成number类型数据
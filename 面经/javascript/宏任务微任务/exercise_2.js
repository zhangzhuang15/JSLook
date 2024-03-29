console.log(1)

setTimeout(function() {
    console.log(2)
    process.nextTick(function() {
        console.log(3)
    })
    new Promise(function(resolve) {
        console.log(4)
        resolve()
    })
    .then(function() {
        console.log(5)
    })
})

process.nextTick(function() {
    console.log(6)
})

new Promise(resolve => {
    console.log(7)
    resolve()
})
.then( _ => {
    console.log(8)
})

setTimeout(function() {
    console.log(9)
    process.nextTick(function() {
         console.log(10)
    })
    new Promise(function(resolve) {
        console.log(11)
        resolve()
    })
    .then(function() {
        console.log(12)
    })
})


// node11 (包括11)之后，浏览器端和node端不存在差异！

// node11之前结果如下
// 1
// 7
// 6
// 8
// 2
// 4
// 9
// 11
// 3
// 10
// 5
// 12
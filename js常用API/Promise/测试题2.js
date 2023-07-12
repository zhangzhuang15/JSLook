new Promise( resolve => {
    throw new Error('Error')
}).catch( err => {
    console.log("1")
} )

new Promise( async resolve => {
    throw new Error('Error')
}).catch( err => {
    console.log("2")
})

// 看看哪个会报错？


// 当没有指定 async 的时候， throw一个错误等效于 reject(err)
// 但是指定了 async 之后， throw 一个错误相当于在全局抛错

// Promise 内抛出的异常，只要未经捕获，就会直接上升为全局异常，不会层层上传
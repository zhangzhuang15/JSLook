console.log("beginning")

setImmediate(() => console.log("Wakaka"))

setTimeout( () => {
    console.log("Aha")
}, 2000)   

setTimeout( () => {
    console.log("GaGa")
    process.nextTick( () => { console.log("GaGa 0")})
}, 0)

// 优先级更高， Oh oh 先于 promise2 打印出来
process.nextTick( () => console.log("Oh ho") )

new Promise( resolve => {
    console.log("promise1")
    resolve()
}).then( _ => { console.log("promise2")} )

console.log("coming to an end")


// beginning
// promise1
// coming to an end
// Oh ho
// promise2
// GaGa
// GaGa 0
// Wakaka
// Aha

// 执行代码，发现同步代码立即执行，发现异步代码，加入到相应的队列中，在事件循环中执行；
// setImmediate加入到 check 阶段的队列中；
// setTimeout 加入到 timers 阶段的队列中；
// process.nextTick 的代码在下一个事件循环开始前执行；
// 于是， 只有 "beginning"  "coming to an end" 先被打印出来了。
// ok，代码执行完了，准备进入事件循环，这时 "Oh ho" 先被打印出来啦；
// 之后，正式进入事件循环，事件循环第一个阶段的 timers 阶段，因此 "Aha“被打印出来啦；
// 事件循环继续走，走到 check 阶段，此时 ”Wakaka“被打印出来啦。
//
// 注意:
//      Aha Wakaka 的输出顺序不是固定的；
//      因为 setTimeout 虽然指定 0， 但是并不意味着事件循环进入到 timers 阶段就被立即执行，
//  只有计数器为 0 时，才会被取出执行，而计数器的行为并不稳定。

//
//
//
//
//    EventLoop
//                    step                        step queue
//    
//    | ----------->  timers                    [timers queue]
//    |                 |
//    |                 v
//    |            I/O callback                [I/O callback queue]
//    |                 |
//    |                 v
//    |            idle, prepare               [node internal queue]
//    |                 |
//    |                 v
//    |               poll                     [poll queue]        if [check queue] is empty, keep blocked; otherwise, go to check
//    |                 |
//    |                 v
//    |               check                    [check queue]
//    |                 |
//    |                 v
//    | <----------- close callback            [close callback queue]
//
//
//    process.nextTick(callback) will add callback into [next tick queue];
//    In any step of eventloop, 
//    before operate the next callback in step queue, 
//    check [next tick queue] firstly,

//    if [next tick queue] is not empty:
//                  1、 stop the eventloop 
//                  2、 operate the callback until [next tick queue] is empty
//    continue the eventloop
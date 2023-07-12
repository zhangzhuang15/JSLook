async function sayHello() {
    console.log("sayHello is invoked");
    return new Promise( 
        resolve => {
            setTimeout(
                () => {
                    console.log("say hello");
                    resolve("say hello");
                }
            ,4000);
        }
    ); 
}

async function sayWorld() {
    console.log("sayWorld is invoked");
    new Promise(
        resolve => {
            setTimeout(
                () => {
                    console.log("say world");
                    resolve("say world");
                }
            ,3000)
        }
    );
    console.log('sayWorld is end')
}


async function run() {
    console.log("running");
    await sayWorld();
    await sayHello();
    console.log("exiting");
}

function main() {
    run()
    console.log("exited");
}

main()


// 执行代码 node main.js
// running
// sayWorld is invoked
// sayWorld is end
// exited
// sayHello is invoked
// 停顿片刻
// say world
// say hello
// exiting
//
//  这表示 await sayWorld并没有发生阻塞，但是 await sayHello 发生阻塞；
//  当函数 F 返回一个Promise对象的时候，await F 会发生阻塞，直到 F返回的Promise 处于 resovled 或者 rejected 状态；
//  否则 await F 不会发生阻塞；
//  
//  还会发现run() 在 await sayHello发生阻塞时，先去执行了 console.log("exited")。
//  我们可以认为sayHello返回一个Promise对象，提前判断 await sayHello 可能发生阻塞，优先从run()中跳出去执行console.log("exited")；
//  因此可以总结到，await阻塞，只能确保async函数内部的先后执行顺序。

// 在第17行代码new 前边加入 await，执行 node main.js
// running
// sayWorld is invoked
// exited
// 停顿片刻
// say world
// sayWorld is end
// sayHello is invoked
// say hello
// exiting
//
//   这表示 await sayWorld 发生阻塞，更具体地讲是 sayWorld函数内发生了阻塞；
//   这再次表明 await Promise会发生阻塞，直到Promise对象状态变为 resolved 或者 rejected 状态；
//
//   还会发现 await sayWorld会发生阻塞，但是在执行第16行代码后，才执行的console.log("exited");
//   因为 sayWorld没有返回值，不能预先判断 是否要阻塞，所以要跳进去看看，于是第16行代码顺利执行，
//   但是到达第 17行代码，发生阻塞了，这才改道回府，执行console.log("exited");


//  顺便补充一点： await 要用在 async 声明的函数内，而 async 声明的函数内可以没有await。
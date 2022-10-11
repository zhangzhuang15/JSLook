const worker = require("worker_threads");

/** 多线程 */

/**
 *  MessageChannel
 *  类似于 管道
 * port1 port2 都是异步的
 */
async function test(){
    const { port1, port2 } = new worker.MessageChannel();
    port1.on("message", message => {
      console.log("message from port2:", message);
    });
    port2.on("message", message => {
      console.log("message from port1:", message);
    });
    port1.on("close", () => {
      console.log("port1 关闭了");
    });
    port2.on("close", () => {
      console.log("port2 关闭了");
    });

    const buffer = new SharedArrayBuffer(3);
    const array = new Uint8Array(buffer);
    array[0] = 34;
    array[1] = 25;
    array[2] = 100;

    const arrayBuffer = new ArrayBuffer(4);
    const list = new Uint8Array(arrayBuffer);
    list[0] = 29;
    list[1] = 255;
    list[2] = 211;
    list[3] = 12;

    port1.postMessage({data: "123456"});
    port2.postMessage({data: "789abcd"});

    console.log("sharedbuffer before send: ", buffer);
    port1.postMessage(buffer);  // 写成 port1.postMessage(buffer, [buffer])会报错，因为共享内存类型的buffer，其底层内存区
                                // 不允许被移动
    console.log("sharedbuffer after send: ", buffer);

    console.log("arrayBuffer before send: ", arrayBuffer);
    // 发送之后， arrayBuffer的底层内存区将被移动给port1的message变量，只有在
    // port1的message事件响应函数中才能处理，除此之外
    // list arrayBuffer无法进行任何操作,
    // 因为它们底层的内存区不存在了
    port2.postMessage( arrayBuffer, [arrayBuffer]);
    console.log("arrayBuffer after send: ", arrayBuffer);
    // port1触发关闭后， port2也会关闭， 且 port1和port2都会响应close事件
    // 如果不关闭port1或者port2， 进程将不会结束
    setTimeout(() => { port1.close();}, 7000);
}




/** Worker  worker_threads用于cpu密集型任务 */

/** 主线程 */
if(worker.isMainThread){

    // 创建一个子线程 wm
    const wm = new worker.Worker(__filename); 
  
    // 主线程和wm表示的子线程通过一个管道连接，管道的一个port被 wm 持有，另一个 port 被子线程持有

    // 利用 wm的 port，向子线程发送消息
    wm.postMessage(`主线程发送了一个消息给子线程，告诉你，主线的线程ID是${worker.threadId}`);

    // 监听 wm 表示的子线程发送过来的消息
    wm.on("message", message => {
        console.log("子线程发来了信息：", message);
    })

    const { port1, port2 } = new worker.MessageChannel();
    wm.postMessage(port2, [port2]);
    port1.postMessage("hello child thread");
    // port1 关闭，子线程中的 port2也会关闭
    port1.close();
} else {
    /** 子线程 */
    let port = null;
    /** 子线程持有的 port 使用 worker.parentPort 访问 */

    /** 采用 once方法监听事件时，响应一次后，parentPort就会close，导致整个程序退出 */
    worker.parentPort.on("message", 
                         message => {
                           if(message instanceof worker.MessagePort) {
                                port = message
                                port.on("message", 
                                        value => { 
                                          console.log("message from port1 of main thread: ", value)
                                        }
                                )
                           } else {
                            console.log("主线程发来的信息:", message);
                            worker.parentPort.postMessage(`告诉你主线程，我子线程的ID是${worker.threadId}`);
                           }
                         }
     );

    // 调用 close方法 关闭parentPort， 结束进程；
    // 如果 主线程的 port1 和 子线程的 port2 都没有关闭，即便关闭了 parentPort， 整个进程也不会退出；
    setTimeout(() => { worker.parentPort.close();}, 10000);

    // 关闭其中一个port就会结束整个进程，如果不想这样的话，
    // 可以利用 worker.MessageChannel方法生成两个MessagePort，
    // 一个留在主线程， 一个留在子线程，这样任意一个port关闭的时候，
    // wm没有关闭，worker.parentPort没有关闭，进程不会退出，可作为持久性工作。
}


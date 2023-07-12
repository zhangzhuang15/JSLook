/** 连接池发生在客户端，每次新建一个客户端连接服务端，待数据
 *  通讯完成后，客户端断开。下一次再通讯的时候，重新创建一个
 *  客户端去连接服务端。当客户端比较大的时候，反复连接费时费力，
 *  因此产生了连接池的概念，让上一个客户端入池复用。
 */

const net = require("net");

// 简易连接池， 存储 socket
const pool = [];

// 连接池大小
const poolSize = 5;

// 服务端端口号
const port = 55610;


while (pool.length < poolSize) {

        const socket = net.connect( port, 'localhost', () => {
            console.log("连接服务端成功");
        });
        
        // 接到服务端发送过来的数据
        socket.on("data", data => {
            console.log("data from server: ", data.toString());
        });
    
        // socket写入用户内存的数据全部送到网卡缓存后
        socket.once("drain", () => {
            // 此时socket的数据已经发送干净了，可以加入连接池中，
            pool.push(socket);
        });
       
        // socket发送数据，数据会被存入内存缓冲，后续异步送到网卡缓存发送出去
        let finish = socket.write("Get /usr Http/1.1\r\nConnection: keep-alive\r\nUser-Agent: Apple\r\n\r\n{ 'name': 'Picy'}");
        
        // finish == true，表示写入用户内存的数据全部刷新到内核缓存
        if (finish) pool.push(socket);

        // finish == false 表示仍有一部分数据残留在用户内存中，
        // 还没有被刷新到内核缓存，此时需要在 drain事件中处理
    
}

var turn = 0;

var num = poolSize;


/** 再发送 5 轮 */
while (turn < 5) {

    // 这里使用局部变量存储turn值，防止
    // 计时到达后，响应函数使用最终的turn值。
    let index = turn;
    setTimeout( () => {
        // pool中的socket都是数据发送干净的，可以放心取出来使用
        let socket = pool[index];
       
        socket.once("drain", () => {
            socket.end();
        });

        socket.once("close", () => {
            console.log("剩余客户端socket总数: ", num);
        });

        socket.on("end", () => {
            // 释放底层socket占据的资源，触发 close 事件
            socket.destroy();
            num -= 1;
        });

        let finish =socket.write("Get /usr Http/1.1\r\nConnection: keep-alive\r\nUser-Agent: Apple\r\n\r\n{'name': 'Kimmy'}");

        // 代码为简单起见，只模拟间隔一段时间发送两波儿数据，
        // 因此这里直接调用end方法进入半关闭状态啦。
        // end事件将被触发。
        if (finish) socket.end(); 
     
    }, 
    (index + 1) * 1000);

    turn += 1;
}


//                       connect
// client socket   ---------------->     server socket
//       ^                                      v
//       ^                                      v
//       ^              < < < <          server worker-socket
//
//
// 在client socket 连接上 server socket后，后续的数据传输、交互过程发生
// 在 client socket 和 server worker-socket 之间。client加入
// 连接池，client socket 和 server worker-socket是不会断开的，因此可以
// 复用。一旦client socket 或者 server worker-socket其中一方发送FIN数据
// 报，那么双方就会断开，client socket无法再发送数据啦，只能重新connect。
//
// 所以，使用连接池确实可以减缓 connect时资源分配带来的延时；
// 同时，还应注意到，服务端的 server worker-socket 一直处于活跃状态，占据
// 服务端的资源，对服务端也会带来一定压力。



// 本代码只是一种最为原始的连接池，只能说明原理，无法生产使用。真正的连接池还需要
// 进一步封装成完整的对象，融入大块数据传输解决方案，连接池中socket调度器，promise
// 技术等等。

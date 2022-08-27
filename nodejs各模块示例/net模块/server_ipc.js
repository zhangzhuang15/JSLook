const net = require("net");
const fs = require("fs")
/** IPC */
const server = net.createServer( socket => {
    console.log("server is connected");
    console.log("server socket remoteAddress: ", socket.remoteAddress);
    console.log("server socket remotePort: ", socket.remotePort);
    console.log("server socket localAddress: ", socket.localAddress);
    console.log("server socket localPort: ", socket.localPort);

    socket.on("data", data => {
        console.log("server socket receive data from client: ", data.toString());
        socket.write("server socket send message when receive data from client");
    });

    socket.on("end", data => {
        console.log("client close itself");
        socket.write("server socket can continue to send message");
    });

    socket.on("close", () => {
        console.log("server socket is also closed");
    });
});


/**
 *  SIGINT   针对 contrl+C 或者 contrl + D 的事件；
 *  SIGKILL  该事件NodeJs不支持监听；
 * 
 *  当 SIGINT 事件发生后，会执行回调函数，记住要在回调函数中执行 exit方法，否则进程不会在ctrl+C后退出；
 * 
 *  process的 exit事件指的是 进程没有事件继续监听，才退出的情形，不包含 ctrl + C 信号机制退出的情况；
 */
process.on("SIGINT", () => {
    const sock_file_path = __dirname + "/server.sock"
    if (fs.existsSync(sock_file_path)) {
        fs.rmSync(sock_file_path)
    }
    process.exit()
})

/**
 *  会创建socket link类型的文件 server.sock, 用于进程间通讯；
 *  该文件通过 ls -a指令可以看到；
 *  当本进程退出后，该文件不会消失。
 * 
 *  如果server.sock存在，server.listen将失败;
 * 
 *  listen是 异步的，进程并不会立即阻塞
 */
 server.listen(__dirname + "/server.sock", () => {
    console.log("server is listening ./server.sock");
});

// server执行 close 方法后，close事件触发
server.on("close", () => {
    const sock_file_path = __dirname + "/server.sock"
    if (fs.existsSync(sock_file_path)) {
        fs.rmSync(sock_file_path)
    }
})

// 使用套接字走的是本地通讯哦，没有网络的事儿。
/**
 * 实现 udp socket编程
 * 
 * udp socket介绍：
 *   udp socket是无连接的，发送数据的时候必须指定接收方的IP地址和端口，
 * 因此，严格意义上来讲，udp socket是没有客户端和服务端之分的。
 *   每一个socket都应该分配一个端口号，如果程序员不指定，将由操作系统指定，
 * 如果程序员想指定端口号，就应该调用 bind方法。
 *   socket在使用send方法发送数据时，可以不指定接收方的IP地址和端口，但是
 * 要使用connect方法绑定对方的IP地址和端口号，以后再调用send方法，数据就
 * 会发送到这个IP地址和端口号上。与TCP不同的是，connect方法不会向接收方
 * 发送请求，TCP socket会发送请求。
 *   当一个udp socket接收到数据时，该socket直接接收数据，而TCP socket会
 * 生成一个新的socket用于接收数据。
 *   因为是无连接的socket，当接收方的socket关闭时，发送方不会收到影响。也就是
 * 说， udp socket是否关闭，只取决于它自己或者进程错误。
 * 
 * 
 * nodejs 是对udp socket做了一层封装，部分细节被隐藏，如果想知道更多socket编程
 * 的细节，应采用c语言的socket编程，它里边的API暴露的信息更多。 
 */
const dgram = require("dgram");

const serverSocket = dgram.createSocket("udp4");
const port = 8006;

serverSocket.on("listening", () => {
    // udp 服务器绑定一个端口时触发
    console.log("服务端绑定了端口: ", port);
});

serverSocket.on("message", (msg, rinfo) => {
    // udp 服务器收到数据时触发 msg是发送过来的数据， rinfo是发送端的socket对象信息
    console.log("客户端地址: ", rinfo.address);
    console.log("客户端IP类型: ", rinfo.family);
    console.log("客户端端口号: ", rinfo.port);
    console.log("客户端发来的消息大小: ", rinfo.size);

    console.log("服务端收到了数据: ", msg.toString());
    console.log("服务端收到的数据的大小: ", msg.length);
    if(msg.toString() == "close"){
        serverSocket.close(); // udp是没有连接机制的，因此服务端关闭socket后，不是一定会导致客户端关闭。
        return; // 不加上这句，程序会执行下一句，可这时，socket已经关闭了，会触发错误
    }
    // udp是无连接的通讯方式，发送数据必须指定接收方的地址和端口
    serverSocket.send("服务端收到数据了", rinfo.port, rinfo.address);
});

serverSocket.on("connect", () => {
    // 当有客户端socket关联服务端地址和端口时触发
    console.log("服务端收到了一个客户端的connect请求");
});

serverSocket.on("close", () => {
    // 服务端的socket关闭时触发
    console.log("服务端的socket关闭了");
});

serverSocket.bind(port); // 开启监听 port
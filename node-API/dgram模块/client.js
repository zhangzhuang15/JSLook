const dgram = require("dgram");

/** udp客户端 */
const clientSocket = dgram.createSocket("udp4");
const clientPort = 8077;
const port = 8006;

clientSocket.on("listening", () => {
    console.log("客户端绑定了端口: ", clientPort);
});

clientSocket.on("connect", () => {
    console.log("客户端关联一个服务端的地址和端口了");
});

clientSocket.on("close", () => {
    console.log("客户端的socket关闭了");
});

clientSocket.on("error", err => {
    console.log("客户端发生了错误:", err);
});

clientSocket.on("message", (msg, rinfo) => {
    console.log(`收到来自服务端${rinfo.address}:${rinfo.port}的数据${msg.toString()}`);
});

clientSocket.bind(clientPort, "localhost"); // 指定一个 port， 否则操作系统会自动提供一个 port

clientSocket.connect(port, 
                    "localhost",
                    () => {
                        clientSocket.send("第一条数据");
                     }
);                                       // 必须在socket发送数据之前使用，在发送数据后使用，会报错；
                                         // socket 发送的数据之后会默认发送到这个 port；
                                         // udp 没有连接的概念哦；


setTimeout( () => { 
    clientSocket.send("第二条数据");
}, 3000);

setTimeout(() => { 
    clientSocket.disconnect(); // 取消 socket 默认发送数据到 port 端口，后续使用send方法，需要给出 port
    clientSocket.send("close", 
                       port, 
                       "localhost",
                       (err, bytes) => {
                           if(!err) {
                               console.log("最后发送了", bytes, "bytes数据");
                               clientSocket.close();
                           }
                       }
    );
}, 6000);
console.log("客户端已经发送第一条数据");
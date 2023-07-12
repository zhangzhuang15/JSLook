const net = require("net");

function createServer() {
    
    /** 创建一个TCP服务端套接字对象 server */
    const server = net.createServer(
        /** 当有客户端连接server时，server会生成另一个
         *  套接字对象 socket ，处理该客户端的请求；
         * 
         *  在没有客户端连接时，如果server内部没有发生
         *  什么状况，server将一直等待，进程不会退出；
         */
        socket => {

            // 处理客户端发送过来的数据
            // data是 Buffer 类型
            socket.on("data", data => {
                console.log("data from client: ");

                // data是Buffer，存储字节码，可读性贼差
                // 使用 toString转化为 utf-8字符串
                console.log(data.toString());

                socket.write("thank you");
            });

            // 该事件不会发生
            //
            //                        connect
            //  client socket   ---------------->     server socket
            //       ^                                      v
            //       ^                                      v
            //       ^              < < < <          server worker-socket
            //
            //  本代码中的socket指的就是 server worker-socket，它不负责connect过程，
            //  只需要和 client socket交互，接受对方的请求，返回响应。
            socket.on("connect", () => { 
                console.log("ok, I connect you client");
            });


            socket.on("close", hasError => {
                if (hasError) console.log("套接字关闭时出了点问题");
                else console.log('套接字关闭啦');
            });

        }
    );

    return server;
}

const server = createServer();
const port = 55610;
server.listen(port, '127.0.0.1');
server.on('connection', () => {
    console.log('卧槽，有client连我');
});
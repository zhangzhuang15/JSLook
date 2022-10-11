/**
 * net模块用于创建TCP或者IPC的客户端和服务端
 * 
 * 当使用其他主机的IP PORT 时，相当于创建TCP服务器和TCP客户端；
 * 当使用文件系统中的路径时，相当于在一个主机上创建服务端和客户端，以此实现IPC通讯；
 */

const net = require("net");

/**
 * TCP 
 * 客户端socket套接字向服务端socket套接字发送请求时，服务端socket套接字会生成
 * 一个工作套接字与客户端套接字进行交互。 net.createServer创建的net.Server对象
 * 底层绑定的就是服务端套接字。net.Server对象connection事件回调函数中的net.Socket
 * 类型参数，底层绑定的就是工作套接字。
 * 
 *             read-end    <----------   write-end
 *          /               data flow             \
 *   套接字A                                      套接字B
 *          \               data flow             /
 *             write-end   ----------->  read-end
 * 
 * 使用方法：
 *    1、调用 net.createServer（）方法创建 net.Server对象
 *       该方法中可以设置 options: { allowHalfOpen: false; pauseOnConnect: false }
 *       改变默认的socket套接字半开关状态，以及发生连接时socket的暂停状态
 *       同时，可以传入一个回调函数，当有新的客户端连接到该服务端时，就会执行该回调函数
 *    
 *    2、调用net.Server对象的listen(port, callback)方法，监听端口.
 *       监听成功后，callback回调函数会执行。
 *       只有在监听完成后，服务端才会真正接受请求
 *       listen方法还有其它重载格式，必要时可查看官网API；
 * 
 *    2、监听事件，处理请求
 *       net.Server对象有很多事件可以被监听，服务端对请求的处理，其实也是在事件的响应函数中完成的
 *       "connection"     callback(socket) 新的客户端连接服务端套接字时，产生该事件
 *                        回调函数中socket是net.Socket对象，该对象用于接受客户端的请求，发送响应，
 *                        该对象还可以获取客户端套接字的IP地址，以及服务端套接字的IP地址。
 * 
 *       “close”          callback()  当服务端套接字关闭时产生该事件
 * 
 *       "listening"      callback()  当服务端套接字成功监听端口时产生该事件
 * 
 *       “error”          callback(err: Error)  当服务端套接字发生错误时产生该事件
 * 
 *    
 *      在和客户端交互时，是由Server对象在connection事件发生时，创建的工作套接字Socket对象完成的，
 *      而该对象和客户端的交互过程是在它的事件中完成的，因此要了解一下net.Socket对象都有哪些事件。
 * 
 *       “lookup”         callback(err: Error | null, 
 *                                 address: string, 
 *                                 family: string | null,
 *                                 host: string)
 *                                    当本端套接字开始TCP连接另一端套接字时产生该事件，该事件发生在
 *                                    connect事件之前。callback函数的参数会反映另一端套接字的IP地址
 *                                    地址类型，主机名。  
 * 
 *       “connect”        callback()  当本端套接字TCP连接到另一端套接字时产生该事件
 * 
 *       “ready”          callback()  当本端套接字可以收发数据时产生该事件，该事件会在connect
 *                                    事件后立即发生
 * 
 *       “data”           callback(chunk: Buffer | string)
 *                                    当本端套接字read端获取到另一端套接字发送的数据时产生该事件
 *       
 *       "end"            callback()  当另一端的套接字发送FIN包并关闭其写入端，而本端套接字就会产生
 *                                    该事件，这意味着另一端发送的数据已经全部被本端套接字收到，且另
 *                                    一端套接字到本端套接字的数据通道已经关闭。
 *                                    如果本端套字节在创建时，将 allowHalfOpen设置为 true，那么
 *                                    必须在callback回调函数中调用套接字对象socket的end方法，才能
 *                                    关闭本端套接字到另一端套接字的数据通道，整个TCP才能断开；如果
 *                                    allowHalfOpen使用默认值false，那么无需在回调函数中调用end方法，
 *                                    在回调函数callback执行后，node会自动关闭本端套接字到另一端套接
 *                                    字的数据通道。
 *                                    
 *       "drain"          callback()  当本端套接字write端缓冲区中上一次未发送出去的数据清空时，产生该事件
 * 
 *       “error”          callback(err: Error) 
 *                                    本端套接字发生错误时产生该事件，该事件要在close事件前发生
 * 
 *       “close”          callback(hasError: boolean) 
 *                                    本端套接字完全关闭时产生该事件，通过callback参数可以判断本次关闭
 *                                    是否因为发生错误而关闭的
 *                                   
 *       “timeout”        callback()  本端套接字在设置的时间内未活动（收数据或者发数据），产生该事件。
 *                                    该事件发生时，node并不会关闭本端套接字，所以需要在callback方法
 *                                    中主动调用socket.end方法。
 *                                    
 */
const server = net.createServer(socket => {
    /**
     * 本回调函数，会加入到server的connection事件中
     * 当有客户端连接到服务端的时候，服务端就会新建一个
     * socket与之相连，而后，执行回调函数
     */
    /** 获取服务端工作套接字socket的IP地址和端口号 */
    console.log("server socket localAddress: ", socket.localAddress);
    console.log("server socket localPort: ", socket.localPort);
    /** 获取客户端socket套接字的IP地址和端口号 */
    console.log("server socket remoteAddress: ", socket.remoteAddress);
    console.log("server socket remotePort: ", socket.remotePort);
    // 服务端工作套接字socket关闭
    socket.on("close", hasError => {
        console.log("server socket is closed");
        if(hasError){
            console.log("err happen when close");
        }
    });
    // 服务端工作套接字socket收到客户端的数据
    socket.on("data", data => {
        console.log("data from client : ", data.toString());
        socket.write("*Hello client 1*");
    });
    // 服务端工作套接字socket收到客户端传来的所有数据时
    socket.on("end", () => {
        console.log("server log: client closed its write-end, server will close its read-end");
        socket.write("*Hello cilent 2*");
    });
    // 服务端工作套接字socket 写缓存区清空时
    socket.on("drain", () => {
        /** 不会输出，因为socket写入到写缓存的数据远小于缓存空间，
         *  这种写不满的情况，无法触发 drain事件
         *  drain事件发生的前提条件就是 写满缓存
         */
        socket.write("*ok, I see*");
    });
});
server.listen(9008, () => {
    console.log("TCP server is listening 9008");
});
server.on("listening", () => {
    console.log("server is listening");
});
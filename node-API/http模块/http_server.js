const http = require("http");

/**
 * http服务端用法：
 *   1、调用 http.createServer方法创建服务器对象http.Server
 *      该方法中可以传入回调函数，作为request事件的一个响应函数
 * 
 *   2、调用服务器对象http.Server的listen方法监听端口号，准备接受客户端请求
 * 
 *   3、通过服务器对象http.Server的事件机制，和客户端交互。
 * 
 *      "checkContinue"            callback(req: IncomingMessage, res: ServerResponse)
 *                                 当收到 HTTP Expect: 100-continue 的请求时产生该事件
 * 
 *      "checkExpectation"         callback(req: IncomintMessage, res: ServerResponse)
 *                                 当收到 HTTP Expect请求头（值不是 100-continue）时产生该事件
 * 
 *      “clientError”              callback(exception: Error, socket: stream.Duplex)
 *                                 客户端发生error事件时，服务端会产生该事件
 *                                 由 exception可以获知客户端发生的具体是什么错误，同时可以通过
 *                                 socket返回给客户端响应，但要先判断socket是否可写。
 * 
 *      “close”                    callback()
 *                                 服务端关闭时产生该事件
 * 
 *      “connect”                  callback(req: IncomingMessage, socket: stream.Duplex, head: Buffer)
 *                                 收到客户端发送的connect方法类型请求时产生该事件，如果服务端没有监听该事件，
 *                                 客户端将关闭连接
 * 
 *      “connection”               callback(socket: stream.Duplex)
 *                                 服务端建立新的TCP流时产生该事件
 * 
 *      “request”                  callback(req: IncomingMessage, res: ServerResponse)
 *                                 当有新请求发送到服务端时产生该事件
 *                                 这个请求可能是一个新客户端发送的，也可能是已存在的客户端处于长连接状态下发送的新请求
 * 
 *      “upgrade”                  callback(req: IncomingMessage, socket: stream.Duplex, head: Buffer)
 *                                 客户端请求HTTP升级时产生该事件
 * 
 *      "listening"                callback()
 *                                 服务端成功监听端口时产生该事件
 *  
 *      一般情况下的http请求接收和响应返回发生在request事件的回调函数
 *      利用req（类型为IncomingMessage的对象），获取请求信息
 *      利用res（类型为ServerResponse的对象），返回响应信息
 */

const server = http.createServer((req, res) => {
    /**
     *  req <IncomingMessage> 表示客户端发来的信息
     *  res <ServerResponse>  表示服务端回传的响应对象
     * 
     * 
     *  IncomingMessage继承 stream.Readable， 是可读流，具有如下事件
     *    data      callback(chunk: Buffer | string | any)
     *              当缓存区中还有数据可以读入的时候触发
     * 
     *    end       callback()
     *              当缓存区中再也没有数据可以读入的时候触发，
     *              表明另一端发送过来的数据已经全部被接收到了
     *              这和socket的end事件有些区别，socket的end事件会涉及到套接字写端的关闭，这里不涉及
     * 
     *    close     callback()
     *              当底层文件流关闭的时候
     * 
     *    error     callback(err: Error)
     *              当底层文件流发生错误的时候
     * 
     *    readable  callback()
     *              当缓存区中有数据的时候触发，要配合 req.read方法使用，才能读到数据
     * 
     *    pause     callback()
     *              当调用req.pause方法由流动模式切换到非流动模式时触发
     * 
     *    resume    callback()
     *              当调用req.resume方法切换回流动模式时触发
     * 
     *   流动模式中，数据作为响应函数的参数供程序员使用
     *   非流动模式中，程序员要手动调用可读流的read方法才能获取到数据
     * 
     * 
     *   ServerResponse 继承OutgoingMessage, 是可写流，也存在事件：
     *   drain      callback()
     *              当缓冲区中的数据被消费干净时触发
     * 
     *   finish     callback()
     *              当缓冲区中的数据传送到操作系统缓存区时触发（此时数据并没有发送给客户端）
     * 
     *   error      callback(err: Error)
     *              当底层文件流发生错误时触发
     * 
     *   close      callback()
     *              当关闭底层文件流时触发
     * 
     */
    
    /** 获取请求中的各个信息 */
    console.log("req http version: ", req.httpVersion);
    /** headers 是 nodejs格式处理之后的头信息，是一个对象 */
    console.log("req http headers: ", req.headers);
    /** rawHeaders 是nodejs未做格式处理的头信息，是一个数组 */
    console.log("req http raw headers: ", req.rawHeaders);
    console.log("req http method: ", req.method);
    console.log("req http url: ", req.url);
    console.log("req http status code: ", req.statusCode);
    console.log("req http status message: ", req.statusMessage);
    if(req.aborted){
        console.log("客户端请求已经终止");
    }
    if(req.complete){
        console.log("服务端已成功接收完整的http请求信息");
    }
    let body = "";
    /**
     * 如果是 post 请求，请求体数据通过req的属性是拿不到的，
     * req是IncomingMessage对象，继承了stream.Readable,
     * 要使用可读流的事件或者read方法才能拿到数据。
     * 
     * 这里使用data事件和end事件接收数据。
     * 区别是  req一接收到数据，就会触发 data事件， 但是不知道对方的数据是不是发送完了
     *        当另一方数据发送完毕后，req才会触发end事件
     * 因此，要将二者结合起来使用，才能拿到对方发送过来的完整数据。
     *  
     */
    req.on('data', chunk => {
        if(typeof chunk === "string")
          console.log("chunk is string");
        if(chunk.constructor == Buffer)
          console.log("chunk is buffer");
         /**
         * chunk如果是Buffer对象，它的底层如果存储的
         * 是字符串的字节流，那么Buffer之间求和后，得到就是
         * 字符串，字符的字节会转换成字符，但是数字的字节将不会
         * 转换成字符，会变成16进制表示的字符串。
         */
        body+=chunk;
    });
    req.on("end", () => {
        console.log("客户端发来的body数据：", body);
        /**
         * write方法是向客户端发送响应体的一段数据
         * end方法是向客户端发送响应体的最后一段数据，标志本次报文传输完毕，本次连接中的数据通讯到此为止了
         */
        res.write("收到了");
    });
    req.on("close", () => {
        console.log("req 关闭");
    });
    // 10s 内， 没有收到客户端请求，res就会主动关闭
    res.setTimeout(10*1000, 
                   () => {
                       res.end(() => res.destroy());
                   }
    );
});
server.listen(4008, () => {
    console.log("http 服务器正在运行中  ");
});

/**
 * 服务器开始监听，除非程序本身故障，或者
 * 调用 server.close，服务器程序不会退出
 */
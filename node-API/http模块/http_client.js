const http = require("http");

var agent = new http.Agent({ keepAlive: true });
/**
 *  http客户端用法
 *  1、调用 http.request()发出请求，该方法返回 ClientRequest对象
 *     http.request有很多参数可以设置，本demo中没有展示，见node官网http://nodejs.cn/api/http.html#http_http_request_url_options_callback
 * 
 *  2、监听 ClientRequest对象的事件，处理服务端返回的响应
 *    "abort"               callback()
 *                          当客户端中止发送请求时产生该事件
 * 
 *    “connect”             callback(response: IncomingMessage, socket: Duplex, head: Buffer)
 *                          当服务端返回客户端CONNECT方法请求的响应时产生该事件
 * 
 *    ”continue“            callback()
 *                          当服务端返回 '100 Continue' HTTP响应时产生该事件
 * 
 *    “information”         callback(info: { httpVersion: string, httpVersionMajor: integer,
 *                                           httpVersionMinor: integer, statusCode: integer,
 *                                           statusMessage: string, headers: Object, rawHeaders: string[]
 *                                          })
 *                          当服务端返回 1xx中间响应时产生该事件（不包括101）
 * 
 *    “response”            callback(response: IncomingMessage)
 *                          当服务端返回响应时产生该事件
 * 
 *    “socket”              callback(socket: Duplex)
 *                          暂不清楚
 * 
 *    "timeout"             callback()
 *                          客户端绑定的socket套接字在指定时间内未活动（不接受数据也不发送数据）时产生该事件
 * 
 *    “upgrade”             callback(response: IncomingMessage, socket: Duplex, head: Buffer)
 *                          服务端响应升级请求时产生该事件
 */
var client = http.request(
    { 
      host: "localhost",
      port: 4008,
      path: "/",
      method: "POST",
      agent: agent
    }
);

if (client.reusedSocket) {
    process.stdout.write("client 复用socket套接字\n");
}
/**
 * 注册 response 事件，用于接收服务端返回值
 * res是IncomingMessage对象
 */
client.on("response", res => {
   console.log("server http headers: ", res.headers);
   console.log("server http version: ", res.httpVersion);
   res.on("data", chunk => {
       console.log("服务端返回的数据: ", chunk.toString());
   });
   res.on("end", 
           () => {
               client.destroy();
           }
   );
});


client.on("socket", socket => {
    console.log("client 绑定一个 socket了");
});
var message = { name: "Peter",
                age: 49,
                colors: ["red", "blue"]
              };
    
client.write(JSON.stringify(message));
client.end();
/**
 * 调用end方法后，client将不能再写入数据，本次请求才算发送出去了。
 * 建立一个client的时候，底层就会有一个socket绑定该client，client
 * 发送数据的时候，利用的就是该socket。该socket可能是复用的，也可能是
 * 新建的。之所以调用end之后，无法再发送请求，是因为socket和client分离
 * 了，client找不到一个socket帮它发送信息。分离不保证socket销毁。
 * 
 * 无论是Get请求，还是Post请求，都要调用 end 方法，否则返回值收到后，
 * 客户端程序中的事件循环依旧存在，导致进程不会正常退出；
 * 
 * http模块客户端不支持长连接，如果要用长连接，请采用 net 模块实现。
 */


setTimeout(() => { 
    var rq = http.request(
        { 
          host: "localhost",
          port: 4008,
          path: "/",
          method: "POST",
          agent: agent
        }
    );
    if (rq.reusedSocket) {
        process.stdout.write("client 复用socket套接字\n");
    }
    rq.on("response", 
              response => {
                  response.on("data", 
                              chunk => {
                                  console.log("服务端返回的数据：", chunk.toString());
                              }
                  );
                  response.on("end",
                               () => {
                                   rq.destroy();
                               }
                  );
              }
    );
    let body = { name: "Jane", rank: 5, likes: ['orange', 'melon'] };
    rq.write(JSON.stringify(body));
    rq.end();
}, 6000);
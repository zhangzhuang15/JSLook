/* 服务端直接使用 express框架实现 */
const express = require("express");
const app = express();
const port = 5400;

// 注册路由，以及请求的处理方式。
// req用于获取请求报文的信息，res用于发送响应报文；
app.get('/utils/', (req, res) => {
    let user = req.query.user;
    let callback = req.query.callback;
    // 还记得响应的结构嘛？
    // +++++++++++++++++++++++++++++
    // + http协议版本 响应码 响应码解释 ++
    // + 响应头                      ++
    // +                            ++
    // + 响应体数据                   ++
    // ++++++++++++++++++++++++++++++

    // 设置响应码
    res.status(200);

    // 设置响应头，这里返回的类型是 javascript哦，不是 html
    res.setHeader("Content-Type", "text/javascript;charset=utf-8");

    let param = {
        name: user,
        password: "aungere2334"
    };
    // 返回响应体数据；
    // 瞧见了没，使用 JSON序列化直接将实参传给了handler函数，
    // 浏览器一旦收到，直接就可以运行handler函数啦。
    res.write(callback+'('+JSON.stringify(param)+");");
    res.write("console.log('look, callback is invoked!');");

    // write方法只是将数据写入到内存，并不会随着网卡发送出去；
    // 调用end方法，表示本次响应体的数据已经全都写入内存中啦，
    // 接下来就开始写到网卡数据缓存发送出去啦。
    res.end();

    // 不能再执行 write 方法啦
});


// 服务器监听 port端口，
// 监听成功则会执行回调函数哦。
app.listen(port, () => {
    console.log("server is running!");
});
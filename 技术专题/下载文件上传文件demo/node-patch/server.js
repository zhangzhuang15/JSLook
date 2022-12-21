const http = require("http");

const port = 8006;

const server = http.createServer();

server.keepAliveTimeout = 3 * 1000;

// new client request come
server.on("request", (req, res) => {
    // 开启长链接
    res.shouldKeepAlive = true;

    res.on("close", () => console.log("server res socket close"));

    const url = req.url;

    // 请求类型分类

    // 返回带中文的响应头
    if (url.includes('chinese_header')) {
        headers = req.headers;
        console.log("headers: ", headers);

        const data = [];
        req.on("data", chunk => data.push(chunk));
        req.on("end", () => console.log("body: ", data.join("")));
        
        // 重点：响应头、请求头都是 ascii 码，对于中文，应该进行编码；
        // utf-8编码结果是unicode码，不是ascii码。只在ascii 码表示的
        // 区间中，utf-8编码和ascii编码是一样的。
        const name = Buffer.from("经典收藏").toString('base64');
        res.writeHead(200, 
                     'success', 
                     { 
                        'content-disposition': 
                            `application/zip; name="${name}.zip"`
                     });
        res.write(JSON.stringify({ code: 200, msg: '成功', data: {} }));
        res.end();

    } else {
        res.writeHead(200, 'ok');
        res.end();
    }
    
});

server.listen(port, () => {
    console.log(`server is running at port ${port}`);
});

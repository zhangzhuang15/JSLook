const http = require("http");
const fs = require("fs");

const server = http.createServer();

server.listen("8000")

server.once("listening", () => {
    console.log("server is listening at ", 8000);
})

server.on("request", (req, res) => {
    const url = req.url;
    const headers = req.headers;

    // 解决 CORS 问题
    // 添加此处代码，浏览器端不会在console抛错，但不影响
    // 请求，有没有这些设置，请求都会来到后端；
    // 没有此处设置的话，服务端的response会被浏览器拦截，转化为CORS ERROR状态
    res.setHeader("Access-Control-Allow-Origin", headers.origin || '*');
    res.setHeader("Access-Control-Allow-Credentials", true);

    if (url === '/index.html') {
        res.setHeader("Set-Cookie", [
            "a=4; Path=/api", 
            "b=5; Path=/work/1",
            "c=6", 
            "d=7; Domain=b.com",
            "e=8; Domain=b.com; Path=/work"
        ]);
        res.writeHead(200, 'ok');
        fs.createReadStream("./index.html")
          .pipe(res)
          .on("finish", () => {
            res.end();
          });  
    } else if (url === '/api') {
        const headers = req.headers;
        console.log("Cookie: ", headers.cookie);
        res.writeHead(200);
        res.end("yes");

    } else {
        res.writeHead(404);
        res.end();
    } 
})

/**
 * 如何实验？
 * 
 * 往 /etc/hosts 添加：
 * 127.0.0.1 b.com a.b.com
 * 
 * 启动服务器： node index.js
 * 
 * 浏览器访问：http://a.b.com:8000/index.html
 * 在浏览器开发者面板中观察cookie，
 * document.cookie观察cookie
 * 
 * 点击按钮
 * 观察服务器Cookie打印值
 */
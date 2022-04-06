const http = require("http");
const fs = require("fs");



const server = http.createServer((req, res) => {
    console.log("request content-type: ", req.headers["content-type"]);
    console.log("request method: ", req.method);
    console.log("request url: ", req.url);
    let name, writeStream, readStream;
    // 在所有返回给客户端的响应中带上下边这几个响应头，防止客户端在发送
    // 预检请求和正式请求时报 Origin：null的错误
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Length, Content-Type");
    if(req.method === "OPTIONS")    
      res.end("ok");// 如果不返回给客户端信息，客户端会等到超时后报错
    const reg = /\/path\//;
    const regDownload = /\/download\//;
    if( req.url.search(reg) != -1){
        fs.existsSync("./path") || fs.mkdirSync("./path");
        name = req.url.split("/path/")[1];
        // 发来的请求中，url会被编码，这里要做解码处理
        name = decodeURIComponent(name);
        writeStream = fs.createWriteStream("./path/" + name, { flags: "a"});
    }
    if( req.url.search(regDownload) != -1){
        name = req.url.split("/download/")[1];
        name = decodeURIComponent(name);
        // 打开读入流，读取字节数据
        readStream = fs.createReadStream("./path/" + name);
        readStream.on("data", chunk => {
            res.write(chunk);
        });
        readStream.on("end", () => {
            res.end("ok too ");
        });    
    }
    // 接收到客户端传来的数据时
    req.on("data", chunk => {
        if(name != null && chunk != null){
            writeStream.write(chunk);
        }else{
            res.end("ok");
        }
    });
    // 客户端传完数据时
    req.on("end", () => {
        if(writeStream) writeStream.end();
        if(!readStream) res.end("ok");
    });
    res.on("finish", () => {
        if(readStream) readStream.destroy();
    });
});
server.listen(8099, () => {
    console.log("server is listening");
});
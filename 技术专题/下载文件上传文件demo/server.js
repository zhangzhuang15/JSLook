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
    const regForm = /\/form/;
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
    if(req.url.search(regForm) !== -1) {
        console.log("form data request headers: ", req.headers);
        const [_, boundary] = /boundary=(.*)$/.exec(req.headers['content-type']) || [];
        const data = [];
        req.on("data", (chunk) => {
            data.push(chunk);
        });
        req.on("end", () => {
            // content-type 是 multipart/form-data 的body格式:
            // --{boundary}\r\n
            // Content-Disposition: {value}\r\n
            // Content-Type: {value}\r\n
            // \r\n
            // {content}\r\n
            // --{boundary}--
            const joinedData = Buffer.from(data.join(""));
            const formData = data.join("").split('\r\n');

            const content_start = joinedData.indexOf('\r\n\r\n') + 4;
            const content_end = joinedData.lastIndexOf(`\r\n--${boundary}--`);
            // let content_start = 0;
            // for (let i = 0; i < 4; i+=1) {
            //     let index = joinedData.slice(content_start).indexOf('\r\n');
            //     content_start += index + 2
            // }
            // let content_end = joinedData.length;
            // for (let i = 0; i < 1; i +=1) {
            //     let index = joinedData.slice(0, content_end).lastIndexOf('\r\n');
            //     content_end = index
            // }
            let index = formData.findIndex((value) => value === '--' + boundary);
            if (index > -1) {
                console.log(formData.slice(-3));
                console.log(formData.length);
                const ContentDispositionString = formData[index + 1];
                const ContentTypeString = formData[index + 2];
                const content = joinedData.subarray(content_start, content_end);
                
                const [__, fileName] = /filename="(.*)"$/.exec(ContentDispositionString) || [];
                const [___, type] = /Type: (.*)$/.exec(ContentTypeString) || [];

                if (fileName && type) {
                    
                    const writer = fs.createWriteStream(`./path/${fileName}`, 'binary');
                    writer.write(content);
                    writer.end();
                }
            }
            //res.writeHead(200, 'yes');
            res.end("ok");
        });
        return;
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

// TODO: 为什么下载后的 png 无法打开？content 的编码有问题？
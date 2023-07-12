const http = require("http");

const data = [ "good morning", "good afternoon", "good night"];

const server = http.createServer((req, res) => {
    const url = req.url;
    let index = 0;
    if (url === "/vm/data/message") {
        // 为了配合客户端EventSource，该字头必须加上
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Access-Control-Allow-Origin", "*");
        let timer = setInterval(() => {
            // 回传的数据格式就是 data: 具体的字符串数据 \n\n
            // 如果客户端监听的是自定义事件,比如叫 track
            // 那么服务端应先发送 event: track\n\n
            // 之后再发送 data: 具体数据\n\n
            // 这是 SSE的报文格式要求
            let result = `data: ${data[index%3]}\n\n`;
            res.write(result);
            index++;
            if (index === 6) {
                res.end();
                clearInterval(timer);
            }
        }, 4000);
    }
    res.on("finish", () => {
        console.log("服务端已经返回给客户端数据了");
    });
});
server.listen(8099, () => {
    console.log("server is listening 8099");
});
// 非浏览器环境客户端的 http2 server
const http2 = require("node:http2")
const fs = require("fs")

const port = 8077;
const {
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_STATUS,
} = http2.constants;

const server = http2.createServer( (request, response) => {
    // if(request.url === '/image1.png') {
    //     const chunk = fs.readFileSync(__dirname + "/image1.png")
    //     response.write(chunk)
    //     response.end()
    // }
    // if(request.url === '/') {
    //     const chunk = fs.readFileSync(__dirname + "/main.html")
    //     response.writeHead(200)
    //     response.write(chunk)
    //     response.end()
    // }
} )
.listen(port)

server.on("stream", (stream, headers) => {
    console.log("headers in HTTP/2: ", headers);

    const path = headers[HTTP2_HEADER_PATH];
    const contentType = headers[HTTP2_HEADER_CONTENT_TYPE];

    const route = router[path];

    if (route) {
        route(contentType, stream)
    }
})

console.log("http2 server is listening at ", port);

// simple router
const router = {
    '/hello': (contentType, stream) => {
        if (contentType === 'application/json') {
            stream.respond({ [HTTP2_HEADER_STATUS]: 200 });
            const json = JSON.stringify({
                 code: 200, 
                 msg: 'ok', 
                 data: { hello: 'hello client' }
            });
            stream.end(json);
        } 
        else if (contentType === 'text/html') {
            const html = fs.readFileSync("./main.html");
            stream.respond({ 
                [HTTP2_HEADER_STATUS]: 200, 
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/html' 
            });
            stream.write(html);
           

            /** 服务端主动推送给客户端 */
            stream.pushStream({ 
                [HTTP2_HEADER_PATH]: '/image1.png',
                [HTTP2_HEADER_CONTENT_TYPE]: 'image/png',
            }, (err, pushStream, headers) => {
                console.log("pushStream headers: ", headers);
                if (err) {
                    console.log("err: ", err)
                    pushStream.respond({ [HTTP2_HEADER_STATUS]: 500 }, { endStream: true });
                    return;
                } 
        
                const image = fs.readFileSync('./image1.png');
                pushStream.respond({ 
                    [HTTP2_HEADER_STATUS]: 200 ,
                    [HTTP2_HEADER_CONTENT_TYPE]: 'image/png',
                });
                pushStream.write(image);
                pushStream.end();
            });

            stream.end();
        } 
        else {
            stream.respond({ [HTTP2_HEADER_STATUS]: 404 }, { endStream: true });
        }
    }
};
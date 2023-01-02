const http2 = require("http2");

const {
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_CACHE_CONTROL,
    HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const hostname = 'localhost';
const port = 8077;
const protocol = 'http';
const url = `${protocol}://${hostname}:${port}`

const session = http2.connect(url, { settings: { enablePush: true }});

const request = session.request(
    {
        [HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
        [HTTP2_HEADER_PATH]: '/hello',
        [HTTP2_HEADER_CONTENT_TYPE]: 'text/html',
    }
);

request
    .on("response", (headers) => {
        let buffer = '';
        console.log("response headers: ", headers);

        request.on("data", (chunk) => buffer += chunk)
        request.on("end", () => {
            if (headers["content-type"] === 'application/json') {
                const result = JSON.parse(buffer);
                console.log("get result: ", result);
            }
            else if (headers["content-type"] === 'image/png') {
                console.log("png data: ", buffer);
            }
            else if (headers["content-type"] === 'text/html') {
                console.log("html data: ", buffer);
            }
            
        })
    })
    // TODO: 为什么收不到 push stream
    .on("push", (headers, flags) => {
        console.log("pushStream headers: ", headers);
        console.log("pushStream flags: ", flags);
    })
    .on("close", () => console.log("request is closed"))
    

    
   
        


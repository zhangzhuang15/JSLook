const http = require("http");

const options = {
    port: 8006,
    path: '/test/chinese_header',
    method: 'get',
    headers: {
        'content-type': 'application/zip; charset=utf-8',
        'cache-control': 'no-cache'
    }
};

const client = http.request(options);

client.setSocketKeepAlive(true);

client.setHeader('connection', 'keepalive');

client.on("response", (res) => {
    const headers = res.headers;

    console.log("response headers: ", headers);

    const data = [];
    res.on("data", (chunk) => {
        data.push(chunk);
    });
    res.on("end", () => {
        console.log("response body: ", data.join(""));
    });
});

client.on("error", (err) => {
    console.log("client err");
});

client.on("close", () => {
    console.log("client close");
});

client.write("hello world");

client.end();
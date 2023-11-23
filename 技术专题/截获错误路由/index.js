const http = require("http");
const fs = require("fs");

const Port = 8000;

const server = http.createServer();

server.listen(Port);

server.once("listening", () => {
    console.log(`server is listening at :${Port}`);
});


server.on("request", (req, res) => {
    // url is not including protocol domain and port
    const url = req.url;

    if (url === "/index.html") {
        res.writeHead(200, "ok");
        fs.createReadStream("./index.html")
          .pipe(res)
          .on("error", (err) => {
            console.log(`server error: ${err}`);

            // 可多次调用，后者覆盖前者
            res.writeHead(500, "server error");
            res.end();
          })
          .on("finish", () => {
            res.end();
          });
    } else if (url === "/client.js") {
        res.writeHead(200, "ok", {
            "Content-Type": "application/javascript"
        });
        fs.createReadStream("./client.js")
          .on("error", (err) => {
            console.log(`server error: ${err}`);

            res.writeHead(500, "server error");
            res.end();
          })
          .pipe(res)
          .on("error", (err) => {
            console.log(`server error: ${err}`);

            res.writeHead(500, "server error");
            res.end();
          })
          .on("finish", () => {
            res.end();
          });

    } else if (url === "/worker.js") {
        res.writeHead(200, "ok", {
            "Content-Type": "application/javascript"
        });
        fs.createReadStream("./worker.js")
          .on("error", (err) => {
            console.log(`server error: ${err}`);

            res.writeHead(500, "server error");
            res.end();
          })
          .pipe(res)
          .on("error", (err) => {
            console.log(`server error: ${err}`);

            res.writeHead(500, "server error");
            res.end();
          })
          .on("finish", () => {
            res.end();
          });

    } else {
        res.writeHead(404, "not found");
        res.end();
    }
});


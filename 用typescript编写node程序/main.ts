import http from "node:http"

const server = http.createServer()

server.on("request", (req, res) => {
    if(req.method?.toLowerCase() === "get" && req.url === "/message") {
        res.writeHead(200)
        res.write(new Date().toUTCString())
        res.end()
    } 
    else if(req.method?.toLowerCase() === "get" && req.url === "/stop") {
        res.writeHead(200)
        res.write("ok")
        res.end()

        server.close()
    }
    req.on("data", chunk => {
        if(req.method?.toLowerCase() === "post") {
            console.log("from client: ", chunk.toString())
            res.setHeader("times", 1)
            res.writeHead(200)
            res.end("server got it")
        }
        else {
            res.writeHead(404)
            res.end()
        }
    })
    res.end()
})

server.on("close", () => { console.log("bye-bye")})
server.on("listening", () => { console.log("server is listening")})
server.listen(5510)
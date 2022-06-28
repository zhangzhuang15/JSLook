const http = require('http')

const server = http.createServer()

server.listen(4433)

const pool = []

server.on("request", (req, res) => {
    console.log("req socket === res socket ? ", req.socket === res.socket)
    console.log("remote message: ", res.socket.remoteAddress,':', res.socket.remotePort)
    if (pool.indexOf(res.socket) === -1) {
        pool.push(res.socket)
    } else {
        console.log("res socket is re-used, ")
    }
    
    const headers = req.headers
    console.log('headers: ', headers)

    console.log('method: ', req.method)

    const origin = headers.origin 
    
    res.setHeader("access-control-allow-origin", origin)
    res.setHeader("access-control-allow-methods", "GET,POST,OPTIONS")
    res.setHeader("access-control-allow-headers", 'content-type')

    if (req.method === 'OPTIONS')  {
        // NOTE: end表示要回写给客户端的数据结束了，无法再继续写入数据了，底层的socket接下来
        // 就会把写入到缓存的数据发送给客户端，但是socket本身不会断开连接。
        res.writeHead(200).end()
        return
    }
    const url = req.url
    console.log('url: ', url)
    
    const [_, query] = url.split('?')
    console.log('query: ', query)

    let data = []
    req.on("data", (chunk) => {
        data.push(chunk)
    })

    // NOTE: end 表示客户端发送的数据已经全部发送完毕
    req.on("end", () => {
        console.log("complete data: ")
        data.forEach(chunk => {
            console.log("chunk: ", chunk.toString())
            const _data = JSON.parse(chunk.toString())
            console.log("name: ", _data.name)
            console.log("hobby: ", _data.hobby)
        })

        res
         .writeHead(200, { "content-type": "application/json" })
         .end(JSON.stringify({ name: 'jack', age: 24, phones: ['12233456', '33456445'] }))
    })
})

server.on("upgrade", (req, socket, head) => {

})

const http2 = require('http2')
const fs = require('fs')

http2.createSecureServer( (request, response) => {
    if(request.url === '/image1.png') {
        const chunk = fs.readFileSync(__dirname + "/image1.png")
        response.write(chunk)
        response.end()
    }
    if(request.url === '/') {
        const chunk = fs.readFileSync(__dirname + "/main.html")
        response.write(chunk)
        response.end()
    }
} )
.listen(8077)
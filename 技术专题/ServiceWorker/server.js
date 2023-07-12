const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
    if(request.url == '/') {
        const chunk = fs.readFileSync(__dirname + '/main.html')
        response.write(chunk)
        response.end()
    } else if (request.url == '/worker.js') {
        const chunk = fs.readFileSync(__dirname + "/worker.js")
        response.setHeader("Content-Type", "text/javascript")
        response.write(chunk)
        response.end()
    }
})
.listen(8011)
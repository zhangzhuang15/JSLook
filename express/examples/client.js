const http = require('http')
const fs = require('fs')

const buffer = fs.readFileSync('./image2.jpg')
const req = http.request(
            'http://localhost:8007/files/image2.jpg', 
            { 
                method: 'POST',
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Content-Length': buffer.byteLength
                }
            }
)
req.write(buffer)
req.end()
req.on('response', res => {
    res.on('data', chunk => {
        console.log(chunk.toString())
    })
    res.on('end', () => req.destroy())
})

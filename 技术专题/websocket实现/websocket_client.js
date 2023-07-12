// 基于nodejs标准库实现一个简易的websocket客户端
// 
// http模块无法实现客户端原因：http发送一次客户端请求后，就会断开，没有办法持久连接。
// net模块提供tcp连接的封装，支持tcp连接后，保持持久连接。
//
// 简易实现：
// 1. 服务端数据获取
// 2. 发送数据至服务端
//
// 尚未实现：
// 1. websocket心跳检测
// 2. websocket客户端数据包解码
// 3. websocket客户端框架式封装

const net = require('net')
const events = require('events')
const WsFrame = require('./util').WsFrame
const http = require('http')
const PORT = 4433

const generateRandomKey = (size) => {
    const result = new Array(size)
    for (let i = 0; i < size; i++) {
        const asciiCode = parseInt(Math.random() * (127 - 33 + 1) + 33)
        result[i] = asciiCode
    }
    return Buffer.from(result).toString('base64').slice(0, size)
}

const WsEventEmitter = new events.EventEmitter()
WsEventEmitter.addListener('ws response', (socket, data) => {
    console.log('ws response data: ', data.toString())
    socket.write(WsFrame({ payloadData: 'hello server', isFinal: false, opcode: 1 }))
})


let isHttpResponse = true
const socket = net.createConnection({
    host: 'localhost',
    port: PORT,
    family: 4
})

socket.on('connect', _ => {
    console.log('连接成功')

    socket.write(`GET / HTTP/1.1\r\nconnection: Upgrade\r\nupgrade: websocket\r\norigin: null\r\nhost: localhost:4433\r\nsec-websocket-key: ${generateRandomKey(24)}\r\n\r\n`)
})

// 对端关闭
socket.on('close', err => {
    console.log('对方关闭')
    if (err) {
        console.log('爆出错误：', err)
    }
    WsEventEmitter.removeAllListeners()
})

// 对端传来数据
socket.on('data', data => {
    console.log('server发来数据: ', data.toString())
    if (isHttpResponse) isHttpResponse = false
    else {
        WsEventEmitter.emit('ws response', socket, data)
    }
})

// 对端半关闭，后续不会传送数据
socket.on('end', _ => {
    console.log('server数据发送完毕, 不再传送数了')
    WsEventEmitter.removeAllListeners()
})

// 对端发生异常
// NOTE: 不监听此事件，客户端进程会结束；监听此事件，客户端进程在超时后结束
socket.on('error', err => {
    console.log('server恐怕发生什么错误了')
})

socket.setKeepAlive(true)
socket.setTimeout(60 * 1000)
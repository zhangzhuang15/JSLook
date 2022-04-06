const express = require('express')
const cookieParser = require('cookie-parser')
const router = require('./router')

// 创建一个服务器应用程序 app
const app = express()

// cookie数据解析中间件
const cookie_middleware = cookieParser()

// 向app注册中间件，这样req.body就可以拿到解析后的js对象了
app
.use(cookie_middleware)


// 注册路由
router.registRoutes(app)


// 启动服务器，监听8007端口
app.listen(8007)

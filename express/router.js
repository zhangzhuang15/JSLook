const db = require('./fakeDB.json')
const express = require('express')
const path = require('path')
const fs = require('fs')
const { url } = require('inspector')

var queries = 0


// app: Express
// 注册路由
function registRoutes(app) {
    
    // 处理所有 /* 的请求, 作为全局拦截器使用
    app.all('/*', (req, res, next) => {
        queries += 1
        console.log(`${req.hostname} use ${req.method} visit ${req.path} by ${req.protocol} protocol`)
        // app必须使用 cookie 中间件，否则 req.cookies == {}
        if(req.cookies.token) {
            next()
        } else {
            res.sendStatus(401)
        }
    })

    app.get('/', (req, res) => {
        res.status(200).send("hello wolrd!")
    })


    app.get('/people/:name', (req, res) => {
        // 获取 :name 实际数值
        const name = req.params.name

        const index = db.findIndex( person => person.name === name ) 
        if (index > -1) {
            res.status(200).json(db[index])
        } else {
            res.sendStatus(404)
        }
    })


    app.get('/search', (req, res) => {
        // 获取请求中的 query
        const { name, age } = req.query

        const index = db.findIndex( person => person.name === name && parseInt(person.age) === parseInt(age) )
        if (index > -1) {
            res.status(200).json(db[index])
        } else {
            res.redirect(302, "https://www.baidu.com/")
            //res.status(404).end()
        }
    })


    // 正则表达式也可以哦
    app.get(/.*-message$/, (req, res) => {
        res.status(200).send("cannot find any message")
    })



    // 数据解析中间件,
    // 解析后的数据将存储于 req.body 中；
    // 数据将被解析为 Buffer 对象。
    const bin_middleware = express.raw({ type: ['image/jpeg', 'text/plain'] })
    
    let router = express.Router()
    router.use(bin_middleware)
    // curl http://localhost:8007/files/test.txt 就会触发；
    // 文件下载；
    router.get('/:filename', (req, res) => {
        const filename = req.params.filename
        const resolvedPath = path.resolve(__dirname, 'public', filename) 
        res.status(200).sendFile(resolvedPath)
    })
    // 图片上传
    router.post('/:filename', (req, res) => {
        new Promise( resolve => {
            const filename = req.params.filename
            const resolvedPath = path.resolve(__dirname, 'public', filename)
            const writeStream = fs.createWriteStream(resolvedPath)
            writeStream.on('close', () => { 
                resolve() 
            })
            writeStream.write(req.body)
            writeStream.end()
        })
        .then( _ => { res.status(200).send('upload 成功')})
    })
    app.use('/files', router)



    router = express.Router()
    const json_middleware = express.json()
    const urlencode_middleware = express.urlencoded()
    router.use(json_middleware)
    router.use(urlencode_middleware)
    router.post('/message', (req, res) => {
        let person = req.body
        console.log(person)
        db.push(person)
        res.status(200).send('add new person successfully')
    })
    router.delete('/:name', (req, res) => {
        const name = req.params.name
        const index = db.findIndex(item => item?.name === name)
        if(index > -1) {
            const person = db.at(index)
            db.splice(index, 1)
            res.status(200).json(person)
        } else {
            res.status(404).end("Not found")
        }
    })
    app.use('/persons', router)
}



module.exports = {
    registRoutes
}
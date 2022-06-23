const https = require('https')
const fs = require('fs')

const url = 
"https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/18/44/470594418/470594418-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1654012105&gen=playurlv2&os=hwbv&oi=0&trid=5eb50971ab174234915e5344c201db31u&platform=pc&upsig=5ff7eb0ef7a237f113a81e2a3948b742&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=523100943&bvc=vod&nettype=0&orderid=0,2&agrr=0&bw=40221&logo=80000000"

const file = "泪海.mp3"

const stream = fs.createWriteStream(__dirname + '/' + file, 'binary')

// 创建请求对象，注册回调函数
const request = https.request(url, {
    method: "GET",
    headers: {
        'Accept': "*/*",
        'Origin': "https://www.bilibili.com",
        'Accept-Language': "zh-CN,zh-Hans;q=0.9",
        'Range': "bytes=0-12589435",
        'Host': 'upos-sz-mirrorhw.bilivideo.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
        'Referer': 'https://www.bilibili.com/',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive'
    },
}, res => {
    // 响应出问题时调用
    res.on('error', err => {
        console.log('response err: ' + err)
    })
    // 响应中存在数据时调用
    res.on('data', chunk => {
        stream.write(chunk)
    })
    // 响应中没有数据时调用
    res.on('end', _ => {
        // 结束输出流的写操作
        stream.end()
        // 关闭输出流
        stream.close()
        console.log('下载完毕')
    })
})

// 请求发生错误时调用
request.on('error', err => {
    console.log(err)
})

// 发送请求，请求体数据可以为空
request.end()
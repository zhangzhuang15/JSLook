const https = require('https')
const fs = require('fs')

const isLocal = false;
const url = 
" https://upos-sz-estgoss.bilivideo.com/upgcxcode/00/27/862962700/862962700_nb3-1-30232.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1671969408&gen=playurlv2&os=upos&oi=1875369774&trid=194c82e45c9047b2aef321d3370952e2u&mid=523100943&platform=pc&upsig=bf6c342a90f9ba90b59b480e8183dda4&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=&build=0&agrr=1&bw=8881&logo=40000000"
const file = "/Volumes/MacWin通用/电影/宝莲灯.mp3"

const stream = fs.createWriteStream( isLocal ? __dirname + '/' + file : file, 'binary')

// 创建请求对象，注册回调函数
const request = https.request(url, {
    method: "GET",
    headers: {
        'Accept': "*/*",
        'Origin': "https://www.bilibili.com",
        'Accept-Language': "zh-CN,zh-Hans;q=0.9",
        'Range': "bytes=0-45074016",
        'Host': 'upos-sz-estgoss02.bilivideo.com',
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
## 什么是HLS？
HLS（Http Live Streaming），就是把长视频，分割成若干很短的视频，随着视频播放进度，一点一点加载的技术。

Safari浏览器的`<video>`内置支持HLS，其他浏览器需要第三方代码也可以支持。

## HLS的直观表现
当你看到`<video>`标签的`src`属性，是一个`m3u`文件的链接时，就说明使用了HLS技术。

`m3u`文件里面存储的是若干ts文件链接。ts即`MPEG2-TS`的简称，是一种视频格式。一个ts文件链接，代表一小段儿视频。`m3u`文件还会提供别的信息，比如ts文件的视频长度是多少秒。

## 怎么使用HLS
在Safari浏览器非常简单，将`<video>`的`src`属性赋值为`m3u`文件的链接就可以了。

在别的浏览器，需要第三方库，比如`videojs` `hls.js`，官方都有具体的文档介绍，也讲了如何结合 vue react angular等框架使用。

如果想把hls转化为mp4存储在本地，可以使用`hls2mp4`这个包，其底层转换依赖`ffmpeg`.

有个插曲，我通过Chrome浏览器的network选项卡，将请求得到的ts文件下载到本地，使用ffmpeg转化ts文件时，ffmpeg报出错误，说是我输入的ts文件数据非法。起初，我以为是网站对ts文件内容加密，需要先揭秘为标准的ts文件。通过对网站断点调试，我没有发现它解密。而且Safari浏览器会自动下载ts，正常播放出视频，因此网站不可能对ts文件单独加密。然后我尝试更新了`ffmpeg`，更新之后，就能正常工作了。这很奇怪，因为之前我用 ffmpeg 将浙江卫视的ts文件转换过，没出现什么问题。

## 困惑
Safari浏览器直接支持`m3u`文件，然后我本地写了一个html文件研究了下，发现Safari浏览器会自动发送http2请求获取ts文件，请求头中包含
`Connection: Keep-Alive`, `X-Playback-Session-Id`。

如果我使用nodejs的 http2 模块仿照着发送请求，会有两个错误：
1. nodejs会告诉我，在http2请求头不能设置`Connection`
2. 不设置`Connection`字段了，可以正常发送请求，但是得到的ts文件内容不是二进制数据，而是字符数据，字符内容是一个nginx网络错误

然后我用Chrome浏览器打开使用HLS技术的网站，我发现Chrome浏览器发送http2请求获取ts文件时，`Connection` 和 `X-Playback-Session-Id`都没设置！

更奇怪的是，我使用 nodejs 的 https 模块发送请求获取ts文件，没有设置任何请求头，结果倒是拿到了正确的ts文件内容！可问题是，https走的是http1.1协议啊。
> http2兼容http1.1，向http2服务器发送http1.1的请求是可以的
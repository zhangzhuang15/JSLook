##Description
在参与vscode插件[code cursor](https://github.com/Helixform/CodeCursor)的过程中，遇到上游应用cursor APP的 API更新，导致插件原来的请求无法正常运行。

跟踪 cursor APP 中的请求，发现对方由 http1.1的 https 请求方式改变为 http2.0 + connect protocol + https 的请求方式。

关于 connect protocol 的概念，出自[该网站](https://connect.build/docs/protocol#streaming-request).
> 该网站提出一种connect的框架，将 rpc 开发的理念移植到 http 协议上。本质上，它还是走的 http 协议，但是加入了特别的请求头、引入了特别的响应体内容解析格式。
>

默认的，如果使用 postman 简单发送请求，会按照其默认的解析格式处理响应体，不符合 connect protocol 的格式要求。另外，在该协议下，发出的请求参数也必须到位，否则响应体会告知传参数不对的问题。

因此，需要定制化发送http2请求。
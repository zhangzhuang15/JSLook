## Content
阐述一些 http 相关的概念。

比如：
1. 解释标签`<img>` src 的 格式；
2. 解释一些常见的响应头，请求头格式， 如`Origin` `Referer` ;
...

### svg 的 base64 链接格式
当图片比较小时，可以直接编译为 base64 格式的 url，直接供 `<img>` 的 src 属性使用，节省 http 请求，直接加载图片。  
  
其 src 格式如下：
`data:[图片的 mime-type-name]；base64,[图片字节码的base64编码内容]`


### source-map 的 base64 链接格式
在使用rollup等工具打包项目，指定生成source-map时，编译好的 js 文件结尾总会有一个source-map链接字符串，告知浏览器，编译后的代码到源代码的位置映射。这个链接字符串的格式为
```\n//# sourceMappingURL=data:application/json;base64,[source-map字节码的base64编码字符串]```
> source-map 是 js 中的一种Object对象，其 key-value，记录了编译后代码到源代码的映射关系

### Referer 指的是什么？
Referer 是一个 HTTP 请求头，用于指示来源页面。它指定了发送请求的页面的 URL。服务器可以使用 Referer 头部字段来获取请求的上下文信息，例如用户从哪个页面跳转过来的.

只要浏览器可以获取到请求源，就会带上 referer；

比如你在网页`http://ccc.com/main`, 发送请求`http://api.ccc.com/main`，那么该请求中的 Referer 的值就是 `http://ccc.com/main`


### Origin 指的是什么？
Origin 是一个 HTTP 请求头部字段，用于指示请求的来源。它指定了发送请求的页面的源（协议，域名和端口）。

Origin 头部字段通常用于跨域请求的安全性验证。服务器可以使用 Origin 头部字段来判断是否允许来自特定源的请求。

浏览器发送跨域请求，或者发送同源post请求时，就会自动带上 Origin 字段；

当你：
1. 处于页面 http://lisi.com/page-a;
2. 点击页面的一个按钮，触发了一次AJAX请求`http://api.lisi.com/data/2004`。

请求头中就会包含 Origin 字段，值为 `http://api.lisi.com`, 表明 发出请求的页面 处于哪种协议、哪个域名、哪个端口下的 web app。这样可以让服务方正确处理 cross-origin request。

> Origin 比 Referer 优秀的地方在于，只会暴露 协议名、域名、端口号，不会暴露url的 path 部分。

### Host 指的是什么？
Host 是一个 HTTP 请求头部字段，用于指示请求的目标主机。它指定的域名或 IP 地址。在发送 HTTP 请求时，浏览器会自动添加 Host 头部字段，以便服务器知道请求的目标。

当你：
1. 处于页面 http://lisi.com/;
2. 在该页面发送请求，http://hcp.com/api/v2/list;
   
请求头中就会包含 Host字段： "http://hcp.com", 表示请求的域名和协议是什么，方便服务方的虚拟service工作。
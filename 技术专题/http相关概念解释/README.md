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

### Referer 指的是什么？
当你：
1. 处于页面 http://lisi.com/page-a；
2. 点击页面的超链接，跳转到页面 http://lisi.com/page-b；
3. 点击页面的一个按钮，触发了一次AJAX请求。

请求头中就会包含 Referer 字段，值为 `http://lisi.com/page-a`, 表明 发出请求的页面 是从哪个页面跳转来的。

### Origin 指的是什么？
当你：
1. 处于页面 http://lisi.com/page-a;
2. 点击页面的一个按钮，触发了一次AJAX请求。

请求头中就会包含 Origin 字段，值为 `http://lisi.com`, 表明 发出请求的页面 处于哪种协议、哪个域名、哪个端口下的 web app。

> Origin 比 Referer 优秀的地方在于，只会暴露 协议名、域名、端口号，不会暴露url的 path 部分。
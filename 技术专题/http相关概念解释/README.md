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
当你：
1. 处于页面 http://lisi.com/page-a；
2. 点击页面的超链接，跳转到页面 http://lisi.com/page-b；
3. 点击页面的一个按钮，触发了一次AJAX请求。

请求头中就会包含 Referer 字段，值为 `http://lisi.com/page-a`, 表明 发出请求的页面 是从哪个页面跳转来的。

### Origin 指的是什么？
当你：
1. 处于页面 http://lisi.com/page-a;
2. 点击页面的一个按钮，触发了一次AJAX请求。

请求头中就会包含 Origin 字段，值为 `http://lisi.com`, 表明 发出请求的页面 处于哪种协议、哪个域名、哪个端口下的 web app。这样可以让服务方正确处理 cross-origin request。

> Origin 比 Referer 优秀的地方在于，只会暴露 协议名、域名、端口号，不会暴露url的 path 部分。

### Host 指的是什么？
当你：
1. 处于页面 http://lisi.com/;
2. 在该页面发送请求，http://hcp.com/api/v2/list;
   
请求头中就会包含 Host字段： "http://hcp.com", 表示请求的域名和协议是什么，方便服务方的虚拟service工作。
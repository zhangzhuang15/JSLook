## 浏览器上传文件核心代码
```html
 <input type="file" onchange="uploadFile" />
```
```javascript
  function uploadFile(event) {
      // 获取用户选择的文件 files: Blob[]
      const files = event.target.files

      // 从用户本地读取文件需要用到FileReader
      const reader = new FileReader()
      
      // 以上传用户选择的第一个文件为例
      const file = files[0]

      /*
         根据 file.size 或者 其他属性，可以对文件的大小，
         或者别的方面进行预处理。代码就不给出来了，具体问题具体分析。
      */

      // 异步读取文件， 最终转换为 ArrayBuffer 类型的数据
      reader.readAsArrayBuffer(files[0])

      reader.onload = function(e) {
          // 拿到读取的结果， result: ArrayBuffer
          const result = e.target.result

          // 接下来使用 Ajax 发出去即可
          const xhr = new XMLHttpRequest()
          // 上传时采用 PUT 或者 POST 方法
          xhr.open("PUT", `http://localhost:8099/path/${file.name}`)
          // content-type 根据发送的数据类型设置好
          xhr.setRequestHeader("content-type", "application/octet-stream")
          xhr.send(result)
      }
  }
```




## 浏览器下载文件核心代码
```html
   <button onclick="download">下载</button>
```
```javascript
   function download(event) {
       const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:8099/download/test.mp3")
        xhr.setRequestHeader("Content-Type", "application/octet-stream")
        xhr.onload = function(){

                // 后端传回的数据是字节流，必须要指定blob形式，否则下载的是乱码
                // Blob第一个参数必须是序列
                // Blob第二个参数设置 字节流要转换为的格式
                const blob = new Blob([xhr.response], { type: "audio/mpeg"})
                // 创建 <a></a>，通过触发a使得浏览器下载文件
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // 文件保存时用到的名字，在google浏览器下载文件的时候，左下脚会
                // 出现一个文件名，指的就是这个
                link.download = "test.mp3";
                link.style.display = 'none';
                document.body.appendChild(link);
                // 触发 a ， 开始下载
                link.click();
                document.body.removeChild(link);
            };
        xhr.send(null);
   }
```
## 浏览器端应该注意什么
1. 浏览器可以预览PDF，图片，但是无法预览.doc .xls .ppt, 这些文件默认行为是下载；
2. 后端如果返回 Content-Type: application/x-download，可二进制流实际是一个pdf，即便指定了 Content-Disposition: inline,
   浏览器仍旧会去下载，而不是预览；
3. `<a>` 的 download 只在 href 是同源路径才有效，href 如果是 objectURL, 算作同源；
4. `<img>` 不受同源策略限制；

## 服务端应该做什么
1. 必须解决好 CORS 问题；
   > 响应头不能重复设置, 比如设置了两个 `Access-Control-Allow-Origin`；
   > 如果经过Nginx反向代理，要过滤掉不合适的响应头；
   > 不要相信 postman 调用接口的结果，它和浏览器环境存在差距；
   > 同源策略： 协议名，域名，端口号，全部一致，才算同源；
2. 必须给出 `Access-Control-Expose-Headers`, 让浏览器端读取到必要的响应头数据，比如 `Content-Disposition`;
   > 在google 浏览器 network 选项卡中，看到的响应头，AJAX可能获取不到；

3. 必须给出 `Content-Disposition`, 告诉浏览器是去下载文件(attachment)，还是在页面预览文件(inline);
4. 必须给出正确的 `Content-Type`, 否则前端不指定type的情况下，创建了一个Blob，该Blob是无法被正确解析的；
   > 选择正确的 MIME 类型，避免浏览器产生意外的结果；
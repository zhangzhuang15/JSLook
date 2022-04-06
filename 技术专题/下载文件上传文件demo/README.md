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
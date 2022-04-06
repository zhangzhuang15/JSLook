请到浏览器环境中验证

```javascript

   // 打开网页A
   
   // 在网页A的控制台执行
   localStorage.setItem('name', 'joke')
   sessionStorage.setItem('name', 'joke')

   // 关闭网页A
   // 重新打开网页A
   // 在网页A的控制台执行
   localStorage.getItem('name')     // 'joke'
   sessionStorage.getItem('name')   // null
   

   // 关闭浏览器进程
   // 重新打开浏览器，进入网页A
   localStorage.getItem('name')    // 'joke'

   // 手动清除浏览器缓存数据
   localStorage.getItem('name')    // null

   // 打开网页A 
   localStorage.setItem('name', 'zhang')

   // 打开网页B（A和B不同域）
   localStorage.getItem('name') // null
```
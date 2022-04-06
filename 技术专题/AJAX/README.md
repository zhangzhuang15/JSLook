### 流程
1. 创建对象 `const request = new XMLHttpRequest()`
2. 监听事件
3. 构建请求 `request.open('GET', 'https://www.baidu.com')`
4. 设置请求头 `request.setRequestHeader(key, value)`
5. 发送请求 `request.send()`


### event 
* load  -> response成功被加载
* loadend -> response成功被加载或者失败
* loadstart -> response开始被加载
* progress -> response加载中
* abort -> request被撤销

### request复用
当调用 `request.send()` 并且本次response成功返回或者失败后，  
request可以复用，继续执行`request.open()` `request.send()`
## location

```javascript
 // 浏览器环境运行
 // 假设当前网址 http://www.cat.com/white_cat?age=4&birth=China#Big

 location.href      // "http://www.cat.com/white_cat#Big"
 location.hostname  // "www.cat.com"
 location.port      // ""
 location.host      // "www.cat.com"
 location.hash      // "Big"
 location.pathname  // '/white_cat'
 location.origin    // "http://www.cat.com"
 location.protocol  // "http"
 location.search    // "?age=4&birth=China"

 location.reload()  // 刷新页面, 会发送情求给后端的！
 location.replace("/black_cat")  // 加载 "http://www.cat.com/black_cat" 页面
```

```javascript
  // 假设你位于 http://www.cat.com/white_cat

  localStorage.setItem('name', 'joke')
  sessionStorage.setItem('name', 'joke')

  location.reload()

  localStorage.getItem('name')   // "joke"
  sessionStorage.getItem('name') // "joke"

  location.replace('/black_cat')

  localStorage.getItem('name')  // "joke"
  sessionStorage.getItem('name') // null
```

**注意**：
- `location.reload`
- `location.replace`
- `location.assign`
  > 与replace不同，支持用户可以页面back

会发送请求到后端！



## history
```javascript
   // 假设你处于百度网页，现在你点击百度一下，查询一个关键词，来到关键词查询结果页面
   history.back()      // 后退
   history.forward()   // 前进，回到关键词查询结果页面
   history.go(-1)      // 后退

   // 你每次访问，都会形成一个 history entry 作为历史记录，
   // 该记录中还会带有 一个 state 对象，存储一些信息
   history.state      // 查看 state对象存储的信息

 
  // 假设你位于 http://zhangsan.com/name
   history.pushState({}, '', '/')  

   // 浏览器的路径将会变成 http://zhangsan.com/， 但是页面没有发生任何变化，只是url变了

   history.state    // {}

   history.back()   // url变成了 http://zhangsan.com/name, 页面没有发生变化

   // 你通过点击页面的链接,页面发生刷新，url变为  http://zhangsan.com/age
   history.replaceState({name: 'zhangsan'}, '', '/')

   // url 变成了 http://zhangsan.com/, 页面没有发生任何变化
   history.state   // { name: 'zhangsan'}

   history.back() 

   // 页面发生变化，url变为 http://zhangsan.com/name


   history.pushState({}, '', '/hello')

   // 页面没有变化， url变为 http://zhangsan.com/hello

   // 假设 http://zhangsan.com/hello 是非法路径

   location.reload()    // 出现 404 

   history.back()

   // url 变成了 http://zhangsan.com/name, 但是页面还是404

   location.reload()  // 正常的页面回来了
```
> 从上边的流程操作中可以看到，pushState 和 replaceState 还是很危险的，
> 一旦 location.reload() 出现404界面，不能一步回退，只能两步走，回退+重新加载。
> 在url发生变化的时候，浏览器并不会发送http请求，可一旦reload，就会发出请求。



## `popstate` and `hashchange`
像`vue-router`这样的路由框架：
- 核心是监听`window`对象的`popstate`事件和`hashchange`事件
- 触发前端路由变更：
  - 调用 `history`对象的 `popState` `pushState`方法
  - 修改 `location`对象的 `hash`属性
- 结合具体前端框架，做组件上的渲染更新
## react-router 官网的解释
[入口](https://reactrouter.com/en/main/start/concepts#history-and-locations)

## vue-router 的实现
[跳转](../../vue/vue-router.md)

## location

### 获取路由信息
```javascript
 // http://www.cat.com:7755/white_cat?age=4&birth=China#Big

 location.href      // "http://www.cat.com/white_cat#Big"
 location.hostname  // "www.cat.com"
 location.port      // ""
 location.host      // "www.cat.com:7755" (如果端口号是 http 默认端口号的话，依旧是 www.cat.com)
 location.hash      // "Big"
 location.pathname  // '/white_cat'
 location.origin    // "http://www.cat.com"
 location.protocol  // "http"
 location.search    // "?age=4&birth=China"
```
### 操纵页面
真的会向后端发送请求！
```js 
// http://www.cat.com/color/red

location.reload()  // 刷新页面
location.replace("/black_cat")  // 加载 "http://www.cat.com/black_cat"
location.assign("/white_cat") // 加载 "http://www.cat.com/white_cat"
```
replace 和 assign 的区别：
- 在页面A，执行replace之后，无法通过点击后退按钮，回到页面A；
- 执行assign之后，依旧可以点击后退按钮，回到页面A。

### 对localStorage和sessionStorage的影响

```js
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

## history
history的API操作前端路由，不会发送请求给后端！

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



## window的`popstate`事件
什么时候会触发该事件：
- 用户点击浏览器的前进或后退按钮
- history.back()
- history.go()
- history.forward()

**注意**：
history.pushState() 和 history.replaceState() 不会触发`popstate`事件！

## window的`hashchange`事件 
当url中的hash发生变化，就会触发该事件

## window的`beforeunload`事件 
当用户手动修改url，按下回车时，会触发该事件；
当用户点击页面上的链接，当前页面被替换的时候，会触发该事件；

仅前端路由改变，不会触发该事件；

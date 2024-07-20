## Description
SSR就是服务端直接生成html，返回给前端，前端不需要执行js动态创建DOM节点。

在使用vue/react这样的框架开发代码的时候，html中会有一个挂载点DOM，比如`<div id="root">`,
在这个挂载点之下，是没有任何DOM节点的。html加载的时候，就会执行编译好的js代码，这个js代码
就是我们在`main.js`编写的代码。然后，js会动态生成DOM节点，插入到挂载点DOM下。如果生成的
DOM节点比较大，花费时间比较长，就会出现白屏现象。

而上述的这些过程，最为关键的就只有两点。

第一点是，挂载点DOM下的那个DOM节点；
第二点是，框架层面的js代码，要感知到那个DOM节点，DOM节点上发生什么事件了，可以传播到框架，框架
接下来安排虚拟节点更新什么的；

SSR也必须要满足这两点。

以vue的SSR为例，看看是怎么做的。

第一点，服务端代码有：
```js 
server.get("*", async (req, res) => {
  const app = createSSRApp(App);
  const appContent = await renderToString(app);

  const html = `
  <html>
    <head>
      <title>Hello</title>
      <link rel="stylesheet" href="${manifest["app.css"]}" />
      <script src="/client.js" type="module" ></script>
    </head>
    <body>
      <div id="app">${appContent}</div>
    </body>
  </html>
  `;
  res.end(html);
});
```
vue框架层面，提供了`createSSRApp` `renderToString`API，去生成第一点要用到的DOM节点，
这些节点的内容是 `appContent`。通过返回的html字符串内容看，`appContent`是显式写在
`<div id="app">`下的哦；

`createSSRApp(App)`里的`App`和客户端有没有区别呢？

这是客户端里的App:
```js 
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

这里是SSR时的App:
```js 
import App from "./App.vue";

export default App;
```

看到了吧，二者的App其实指的都是`App.vue`，只不过，在客户端你要用`createtApp`,
在服务端呢，要换成`createSSRApp`，而且是在服务端执行的，不是客户端执行的。

但是呢，服务端生成好的DOM节点，怎么能在框架层面上，知道它被挂载到`<div id="app">`下呢？

这个就是第二点的问题了，解决这个问题的关键，就在于`/client.js`

client.js：
```js 
import { createSSRApp } from "vue";
import App from "./App.vue";

createSSRApp(App).mount("#app")
```
注意，这个是源码，不能直接使用，需要编译一下，编译后的结果作为`/client.js`
返回。这一步的做法，就是让框架知道，`<div id="app">`是挂载点，它下面的DOM
节点就是App的内容，然后将App与之关联起来，这样当App内响应式变量更新时，对应
的DOM节点也才会更新
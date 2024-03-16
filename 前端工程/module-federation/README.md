[toc]

## reference 
[Module Federation](https://module-federation.io/docs/en/mf-docs/0.2/getting-started/)

## what 
什么是 module federation ?

通过一个例子，很好理解。

我们使用webpack开发一个应用，写的组件代码，工具函数代码，最终都会被打包成bundle.js文件，放在服务器上，
用户使用浏览器一访问，就被下载下来，bundle.js文件一执行，页面就被动态构建出来，这就是传统上的SPA。

但是，开发久了，你就会发现，不同的应用之间，有些代码是重复的，比如工具函数库。两个应用打包好了，部署到
服务器上，工具库函数代码实际上是存储了两次。那么，可不可以只存储一次呢？可以，这就是 module federation 
要做的事情。它可以让你的应用直接下载另一个应用的代码或者资源。这个行为，不是在打包过程中发生的，而是在
浏览器执行的时候发生的，当代码执行的时候，发现需要某个代码，然后发送请求，将对应的代码下载下来执行。


## implement 
webpack实现这个的思路，简单讲就是，在webpack配置文件使用 ModuleFederationPlugin, 指定当前应用要暴露
给其他应用使用的module，然后这个插件就会生成一个js文件，当另外一个应用下载这个js文件之后，就可以知道引用
的module在什么地方，然后下载下来使用。

[详细解释](https://module-federation.io/docs/en/mf-docs/0.2/getting-started-practical/)


## use case 
- micro-frontend 
- multiple application integration
- shared library
- third-party integration

## pros and cons 

pros:
- reduce code duplication
- improve collaboration
- great flexibility
- improve performance
- improve scalability

cons:
- more complex 
- more securiy risks
- increase coupling 
- potential performance issues
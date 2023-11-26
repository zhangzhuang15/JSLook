[toc]

## 为什么有本章节？
无论你是
* 前端 app 应用程序的开发者
* node command line 程序的开发者
* 前端开源库或者框架的开发者

你都  
**离不开工程化**

### 什么是前端工程化
简单理解，就是如何搭建一个项目的骨架，配好开发环境。
对于库或者框架的开源开发者，还要考虑npm发版、多个package管理。


### 打包 
常见的打包工具有 webpack, rollup, swc, esbuild等。

无论你使用 js 开发npm项目，还是使用 typescript 开发项目，最终利用打包器生成的最终代码都是 js 代码。而最终生成的 js 代码才是要传到 npm registry的内容。

例子一：
你使用 js 开发一个库，没有使用到任何打包工具，那么你就需要把入口js文件以及它所依赖的js文件传到 npm registry。

例子二：
你使用 js 开发一个库，但是你不想让用户在 npm install 后，看到下载的代码是源码，或者你想把分散的js文件合为一个js文件发布到 npm registry，那么你就需要打包器将代码打包，而且只需要将打包后的代码发布，源码不要发布。

部分内容这里没有说清，会在后文中分散介绍。

### 各配置文件总结
[前往](./配置文件.md)

### package.json 
[前往](./packageJson%E6%96%87%E4%BB%B6.md)

### babel 
js的编译器。
* 将源代码转化为指定模块化格式的js代码；
  > 你用 commonjs代码写的，它可以转为 module 模块风格的代码；
* 将源代码转化为指定标准的js代码；
  > 你用新的es语法标准写的代码，它可以转为 es5 代码；

一般不单独使用，会在前端构建工具生态中作为插件或者loader使用。

单独使用时，一般是有要自定义修改AST的需求，生成特别的js代码。这时候常用@babel/parser包，用它提供的API，在nodejs环境代码中去实现。

更多信息参考 [配置文件.md](./%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.md)


### rollup 
[前往](./rollup%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.md)


### esbuild 
使用go实现的js打包器。
在 vite 中得到应用。

### swc 
待补充

### parcel
待补充

### webpack 
最成熟的构建工具。
支持的范围非常广，无所不包，生态最好。
可以打包js， 也可以打包 ts， 还可以打包 .css .png .jpeg .mp4 等等静态资源，只需要引入对应的 plugin 或者 loader。
和 rollup 不同的是，主张拆包，多作为前端 app 开发的构建工具。
[更具体的介绍](./webpack工程化/README.md)

### Mocha
单元测试框架。

基础原理：
* 将 describe、it 等方法挂载到 global 对象上，实现无需引用即可使用；
* 使用 nodejs 内置的 import 方法引用单元测试文件，触发 describe函数执行，收集回调函数，这些回调函数就是单元测试任务；
* 利用 hooks 原理、插件系统维护整个框架的逻辑；

### 本地开发package的技巧
[前往](./本地开发package的技巧.md)

### publish npm package
[前往](https://snyk.io/blog/best-practices-create-modern-npm-package/)

[发布package](./发布package/README.md)
  
### FAQ
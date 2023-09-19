[toc]

## What is plugin?
* plugin是一个函数或者一个拥有apply方法的对象，其声明的类型为  
`(compiler) => void` 或者   
`class { apply: function(compiler): void }`
> compiler 参数是webpack构建的compiler对象。
* plugin贯穿webpack整个过程，在webpack的生命钩子上注册回调函数，当webpack执行到相应的生命钩子，就会取出钩子上注册的回调函数执行。
* plugin往webpack生命钩子上注册回调函数，回调函数只有一个参数compilation，plugin实现的功能就基于对compilation的操作。
  > compiler和compilation是两回事儿，前者是编译器，是编译代码的，后者是某个阶段上编译的结果。


## 常见的plugin

### html-webpack-plugin
自动生成html文件，将编译好的入口文件引入。

如果不用这个插件，在生成编译好的入口.js文件后，我们需要手动创建html文件，并且自己去搞定引入的路径问题，然后将.js文件引入其中。

### progress-bar-webpack-plugin
将编译过程的进度条输出到终端上。  
在其npm的官网上有具体使用的介绍。


### terser-webpack-plugin
在编译过程中压缩javascript。

### case-sensitive-paths-webpack-plugin
严格检查module的路径，一旦不匹配，在编译的时候给出错误提示

### pnp-webpack-plugin
配合 Yarn PnP新特性的插件

### mini-css-extract-plugin
从打包后的js文件中，抽离出css到单独的文件，在HTML中采用`<link>`的方式链接。

看个具体的例子
```js 
// main.js ， webpack入口文件

import "./assets/main.css"
```
只用 style-loader 和 css-loader处理的话，会将`main.css`中的内容转化为DOM中的`style`节点，并使用DOM API插入到 `head`节点中。当编译后的main.js被html文件中引用、执行的时候，`head`节点下就会看到多个新生成的`style`节点，将样式内联进去。

如果我们使用本插件替换 style-loader，就会生成 `link` 节点，而不是 `style`节点，将样式外联进去。

一般的，需要配合html-webpack-plugin使用，但html-webpack-plugin插件并不负责生成`style`节点或`link`节点，只负责生成一个html文件，将编译好的入口文件引入。


[具体解释参考](https://juejin.cn/post/6850418117500715015)

### css-minimizer-webpack-plugin
将css进行优化压缩。

 mini-css-extract-plugin只负责将bundled的css抽离出来，放在一个css文件中，但是css是否得到优化压缩，它却不知道。因此需要本插件提供这样的功能，解决这个问题。

 ### workbox-webpack-plugin
 构建 service worker

 ### webpack-bundle-analyzer
 打包结果的分析工具，帮助你分析哪些代码打包出来的体积偏大。
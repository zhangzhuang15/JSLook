## What is plugin?
* plugin是一个函数或者一个拥有apply方法的对象，其声明的类型为  
`(compiler) => void` 或者   
`class { apply: function(compiler): void }`
> compiler 参数是webpack构建的compiler对象。
* plugin贯穿webpack整个过程，在webpack的生命钩子上注册回调函数，当webpack执行到相应的生命钩子，就会取出钩子上注册的回调函数执行。
* plugin往webpack生命钩子上注册回调函数，回调函数只有一个参数compilation，plugin实现的功能就基于对compilation的操作。
  > compiler和compilation是两回事儿，前者是编译器，是编译代码的，后者是某个阶段上编译的结果。


## 常见的plugin

### progress-bar-webpack-plugin
将编译过程的进度条输出到终端上。  
在其npm的官网上有具体使用的介绍。


### terser-webpack-plugin
在编译过程中压缩javascript。
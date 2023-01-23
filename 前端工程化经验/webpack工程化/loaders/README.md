## What is Loader
* loader是函数，声明类型为 (source: string) => string.  
* loader的用途就是将文件内容进行转换。
* loader在webpack打包过程中，输出bundle文件之前发挥作用。

## loader优先级
优先级越高的loader越先执行

loader按照优先级由高到低分为
* pre loader（前置loader）
* normal loader （普通loader，默认的级别）
* inline Loader
* post loader （后置loader）
  
在同级别的loader之间，越靠后的loader优先级更高
```javascript {.line-numbers}
// webpack.config.js 

module.exports = {
    module: {
        rules: [
            {
                test: /(\.js)$/,
                use: [
                    'loader1',
                    'loader2',
                    'loader3'
                ]
            }
        ]
    }
}
// 执行顺序 loader3 loader2 loader1
```

## 常见的loader

### sass-resources-loader
编写sass、scss时，总会引入一些全局的变量、mixin，每次都要手动@import一遍非常麻烦，使用这个loader就可以在编译的过程中，将要引入的全局内容自动插入到我们编写的sass、scss文件中，我们在编写scss、sass代码时，就可以直接使用全局的东西。

具体的使用方式，在其npm官网上有详细的介绍，并且给出了具体的配置demo，方便使用。
## What is Loader
* loader是函数，声明类型为 (source: string) => string.  
* loader的用途就是将文件内容进行转换。
* loader在webpack打包过程中，输出bundle文件之前发挥作用。


## 常见的loader

### sass-resources-loader
编写sass、scss时，总会引入一些全局的变量、mixin，每次都要手动@import一遍非常麻烦，使用这个loader就可以在编译的过程中，将要引入的全局内容自动插入到我们编写的sass、scss文件中，我们在编写scss、sass代码时，就可以直接使用全局的东西。

具体的使用方式，在其npm官网上有详细的介绍，并且给出了具体的配置demo，方便使用。
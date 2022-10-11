## 为什么有本章节？
无论你是
* 前端 app 应用程序的开发者
* node command line 程序的开发者
* 前端开源库或者框架的开发者

你都  
**离不开工程化**

## 什么是前端工程化
简单理解，就是如何搭建一个项目的骨架，配好开发环境。
对于库或者框架的开源开发者，还要考虑npm发版、多个package管理。

## 前端工程化涉及到的文件
### package.json 
#### private: true 的情形
1. 你的项目不会发布到npm上，只会通过打包工具生成最终执行的代码部署到服务器上；
2. 你的项目是多package管理的根项目，各个package要发布到npm上，根项目无需发布
   > 这个情形下，你还要指定 workspace，交代多个 package 分布在哪些文件夹下，一般都是放在一个叫 packages 的文件夹下。

#### engines
强烈建议设置此选项。当你搭起一个项目，设置好研发环境时，你安装依赖的库可能对node版本有要求。如果另外有一个人拉取你的项目，想做些贡献，很可能被本地node版本号坑到，无法顺利安装依赖库。通过engines指定好版本，可以提早给出提示，先行告知用户升级node。


## 前端工程化的具体场景
### 浏览器端js库开发
坑：研发的代码是按照 es6 模块化组织的，但是单元测试的代码是跑在 node 环境上的，单元测试代码中肯定要引用模块，会产生引入冲突。
方法：一般单元测试框架都会考虑到这个问题，提供相应的命令行选项，完成对 require 的拦截和代码及时编译。以mocha为例，提供 --require选项，指定该选项为 @babel/register, 就可以在执行 require 时，将引入的模块及时编译为 commonJS风格，供 node 使用。
> 记得 npm install -D @babel/register 
> 其他测试框架要阅读官方介绍

### node js 库开发 
### umd js 库开发
最终是浏览器端还是node端，还是 umd 化，只和打包器的配置相关。也就是说，代码按照 es6 风格或者 commonJS 风格写，最后通过配置打包器，设定好最终编译好的代码是什么风格。
> 库开发，常用 rollup 打包；
> app开发，常用 webpack 打包；
> rollup是将分散在各个模块中的代码集中起来导出；
> webpack是代码分割，按需加载。
> 由于库代码本身不会有多大，因此用rollup那套比较好。
### node command line 开发
### 上述情形转用 typescript开发
两种策略:
1. 引入 typescript, @types/typescript, ts-node(非必需),@typescript-eslint/eslint-plugin;
   > 使用 tsc 对 ts 进行编译
2. 引入 @babel/preset-typescript
   > 使用 babel 和 @babel/plugin-transform-typescript 插件对 ts 进行编译；
   > 预设 @babel/preset-typescript 包含插件@babel/plugin-transform-typescript；

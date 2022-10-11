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

#### exports
node v14.13.0开始支持的字段。
exports 字段可以配置不同环境对应的模块入口文件，并且当它存在时，它的优先级最高。
```json
{
   "name": "packageA",
   "exports": {
      ".": {
         "require": "./dist/main.common.js",
         "import": {
            "node": "./dist/main.m.js",
            "default": "./dist/main.esm.js"
         },
         "types": "./dist/types/index.d.ts"
      },
      "./css/*": "./dist/css/*",
   }
}
```
在node环境，使用`import "packageA"`,会引入 `./dist/main.m.js`;
在node环境，使用`require("packageA")`会引入`./dits/main.common.js`；
如果是 node + typescript 环境，使用 `import "packageA"`，会引入`./dist/main.esm.js`，声明文件从 `./dist/types/index.d.ts`去找。
在浏览器环境，通过cdn引入的是 `./dist/main.esm.js`；


#### unpkg
这是第三方工具要在package.json中用到的字段，package.json本身并没有定义该字段。
`unpkg`指定入口文件。当用户使用unpkg官网的cdn向浏览器中导入npm包的时候，就会将`unpkg`指定的文件导入。
```json
{
   "name": "packageA",
   "unpkg": "./dist/main.esm.js",
}
```
若`<script src="http://unpkg.com/packageA" />`，就会将packageA项目中的`dist/main.esm.js`文件导入。


#### jsdelivr
第三方工具所需字段。  
`jsdelivr`指定入口文件。当用户使用jsdelivr官网的cdn向浏览器导入npm包的时候，就会将`jsdelivr`指定的文件导入。
```json
{
   "name": "packageA",
   "jsdelivr": "./dist/main.esm.js",
}
```
若`<script src="http://cdn.jsdelivr.net/npm/packageA" />`, 就会将packageA项目中的`dist/main.esm.js`文件导入。

#### browserslist
第三方工具所需字段。  
指定浏览器兼容性。  
当使用babel编译代码时，需要知道编译成和什么样的浏览器兼容的代码，此时babel就会读取package.json中的 `browserslist`字段。当然，你可以不用写在package.json中，单独放在`.browserslistrc`文件中。
```json
{
   "name": "packageA",
   "browserslist": [
      ">5%",
      "last 1 version"
   ]
}
```

#### sideEffects
第三方工具所需字段。
指定有副作用的文件有哪些，阻止webpack对这些文件的tree-shaking。
比如使用 webpack 打包的时候，如果 `import css from "packageA/css"` 引入某个包下面的css资源，可是webpack发现你没有使用，就不会把这些css资源打包，此时设置 `sideEffects: ["*.less", "*.scss", "*.stylus"]`，告诉webpack这些文件有副作用，别对它们使用tree-shaking。

#### lint-staged
第三方工具所需字段。
配置 `lint-staged`工具对git暂存区的文件，做哪些操作。
```json
{
   "name": "packageA",
   "lint-staged": {
      "src/**/*.{js,jsx,ts,tsx}": [
         "eslint --fix",
         "prettier --write",
         "git add -A"
      ],
   }
}
```
> 不要忘记 `npm install lint-staged`

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

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

## 细节

### 打包 
常见的打包工具有 webpack, rollup, swc, esbuild等。

无论你使用 js 开发npm项目，还是使用 typescript 开发项目，最终利用打包器生成的最终代码都是 js 代码。而最终生成的 js 代码才是要传到 npm registry的内容。

例子一：
你使用 js 开发一个库，没有使用到任何打包工具，那么你就需要把入口js文件以及它所依赖的js文件传到 npm registry。

例子二：
你使用 js 开发一个库，但是你不想让用户在 npm install 后，看到下载的代码是源码，或者你想把分散的js文件合为一个js文件发布到 npm registry，那么你就需要打包器将代码打包，而且只需要将打包后的代码发布，源码不要发布。

部分内容这里没有说清，会在后文中分散介绍。
### package.json 
#### private: true 的情形
1. 你的项目不会发布到npm上，只会通过打包工具生成最终执行的代码部署到服务器上；
2. 你的项目是多package管理的根项目，各个package要发布到npm上，根项目无需发布
   > 这个情形下，你还要指定 workspace，交代多个 package 分布在哪些文件夹下，一般都是放在一个叫 packages 的文件夹下。

#### workspace 
```json
{
   "name": "packageA",
   "private": true,
   "workspace": [
      "./package/*"
   ]
}
```
表示package文件夹下的每个文件夹，都带有 package.json 文件，也就是说这些文件夹都是一个npm包。

#### engines
强烈建议设置此选项。当你搭起一个项目，设置好研发环境时，你安装依赖的库可能对node版本有要求。如果另外有一个人拉取你的项目，想做些贡献，很可能被本地node版本号坑到，无法顺利安装依赖库。通过engines指定好版本，可以提早给出提示，先行告知用户升级node。

#### main
当你开发的npm项目是一个库时，你要指定这一项，表明库的入口文件。这样，当别人npm install 你的库后，使用require引用你的库，node才知道应该引入哪个文件。

#### files
当你使用 npm publish 发布自己的npm项目时，实际上是将你项目中的所有合理文件夹打包成 tar，然后将tar包上传到registry。别人 npm install 的时候，也是先下载这个 tar包，然后解压恢复成文件夹。  
files的作用就是告诉 npm publish, 项目中到底哪些文件要被打包。默认情况下，`.gitignore` `.git`等文件不会被打包。

#### type
指定你的npm项目采用哪种模块化管理方式，"module" 或者 "commonjs"，**只能二选一**！如果你指定了 “module”，可实际上代码用的是commonJS的方式，node会在执行的过程中报错，但是在vscode编码过程中不会报错。  
如果你没有指定type, 默认为 commonjs.
> 在 node v12.0.0开始，你可以用 module 的模块化管理方式，编写nodejs代码；
> 甚至在一个 .cjs 文件中用 commonjs的方式导出模块，在另一个.js代码中使用 module 方式导入；
> 对于 .cjs 文件，按照 commonjs 组织模块；
> 对于 .ejs 文件，按照 module 组织模块；
> 对于 .js 文件，按照 type 指定的模块化方式组织；

**注意：**
如果你在 .js 文件使用 module 方式导出，在另一个 .js 文件中使用 commonjs 方式导入，需要使用 @babel/register 这样的工具进行及时编译，否则报错！

#### types 
第三方工具所需字段。
这个字段供 typescript 使用。

如果你的库要供给typescript使用，需要为你的js库加入声明文件，而types就是指出声明文件的位置。

#### module
当别人用 module 模块化方式导入你的库时， module 将告诉 node 入口文件在哪里。
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

#### packageManager
该字段告诉别人你使用什么包管理工具，但是这个字段并不会阻止别人用其它包管理工具。  
比如，package.json
```json
{
  "packageManager": "yarn@1.20.2",
  "scripts": {
   "dev": "node index.js"
  }
}
```
别人依旧可以正常执行`npm run dev`

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

### 工程化必备工具
#### babel 
js的编译器。
* 将源代码转化为指定模块化格式的js代码；
  > 你用 commonjs代码写的，它可以转为 module 模块风格的代码；
* 将源代码转化为指定标准的js代码；
  > 你用新的es语法标准写的代码，它可以转为 es5 代码；

一般不单独使用，会在前端构建工具生态中作为插件或者loader使用。

单独使用时，一般是有要自定义修改AST的需求，生成特别的js代码。这时候常用@babel/parser包，用它提供的API，在nodejs环境代码中去实现。

#### eslint 
一个 js 或者 ts 的语法检测器。
* 配合vs code中的 eslint 插件，在你编写 js 或者 ts 代码时，检测书写的语法错误，给出自动修改格式化；
* 配合 eslint的 typescript 插件，才可以检测到 ts 的语法问题；
  > 如果使用 eslint检测  ts 语法问题了，就不需要在 tsconfig.json 配置类型检测方面的参数了。
* 多配合 eslint 的 prettier 插件，对 代码风格进行检测并修改；
  > 此时不需要加入 prettier 配置文件了

eslint 的CLI一般配置在package.json的 scripts中，用于对指定的文件做一次整体检测，而不是依赖vscode eslint插件在书写代码的时候检测。

在 lint-staged 常会用到 eslint CLI，对暂存区的文件做整体检测。
> 文件越多，eslint整体检测一遍的时间越长；但实际上，暂存区的文件并不多，所以要这么做。


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

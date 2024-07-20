[toc]

## 官网
[visit](https://babeljs.io/docs/usage)

## 配置
- `babel.config.json`(recommended, project-range)
- `.babelrc.json`(recommended, subproject-range)
- `babel.config.js`

配置不需要死记硬背，直接访问官网，按照官网指引和自身的需求配置即可

## 使用方式
- babel command 
- babel API
- plugin (webpack or rollup etc)

## 安装 
```shell
pnpm install -D @babel/core @babel/cli @babel/preset-env
```

### webpack 
```shell 
pnpm install -D babel-loader
```

### rollup 
```shell 
pnpm install -D rollup-plugin-babel
```

## babel的那些库
从 **版本7** 开始，babel相关的库以 **@babel** 命名，之前是以 **babel** 命名；

### @babel/core
提供了babel编译功能的API。

内部实现上，调用了 `@babel/parser` `@babel/traverse` `@babel/generator`.

### @babel/cli
babel命令行工具，是一个可执行程序;

其内部实现，调用了`@babel/core`；

实际使用，还需要安装 `@babel/core`;

### @babel/preset-env
babel常见环境的预配置, 在配置文件中引入它，则现有、官方、标准的配置参数会合并到你的配置文件，简化你一个个去配置的过程;

### @babel/parser
专项提供了将js代码转化为AST的API。

把它作为AST生成工具即可。

使用的时候，一般和 `@babel/traverse` `@babel/generator` 组合使用；

### @babel/traverse
专项提供了遍历AST、修改AST节点的API；

### @babel/generator
专项提供了将AST转化为代码的API；

### babel-loader
让你在webpack里使用babel;

告诉babel应该如何处理js文件，babel提供编译代码的能力，但babel不知道哪些js文件需要编译，哪些不需要编译，像这些内容，就需要babel-loader告知babel；


### @babel/runtime
这是一个运行时工具函数的合集，babel的使用者用不上，是babel内部编译时或者插件工作时会调用的；插件代表就是 `@babel/plugin-transform-runtime`;

由 helper, corejs(解决 api 的 pollyfill), regenerate(实现了 async await)组成；

helper 是 babel 开发的，剩下两个是第三方库；

### @babel/plugin-*
babel周边插件，*是名字泛称标记;

`@babel/plugin-transform-runtime`，babel 编译时会注入运行时函数定义到生成代码里，如果多个文件都使用了这个函数，那么函数的定义就会出现多次，这是不必要的，我们只要注入该函数的引用即可，这个插件就是干这个用的；
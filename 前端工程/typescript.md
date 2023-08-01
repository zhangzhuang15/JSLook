[toc]

目前主流的前端项目已经用 typescript 重写。

当项目变大后，javascript无法管理好代码，没有类型约束，很难从代码读出各个变量的含义；

typescript的性能损失小于其代码维护上的优势；

typescript在vscode上有充分的类型提示、api提示，写代码非常友善；


### 编译typescript的策略
* 使用 tsc 直接编译；
* 使用 babel + @babel/preset-typescript编译；
  > 预设 @babel/preset-typescript 包含插件@babel/plugin-transform-typescript；

babel编译的方式存在部分缺点：
1. 不支持typescript的`const enum`语法；
2. 不支持生成类型文件.d.ts;

可以这样平衡两者：
使用 tsc 检查代码语法错误，生成 .d.ts 文件；
使用 babel 生成 js 文件；


### 配置文件
[前往](./tsconfig%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.md)

### 调试
[前往](../调试/README.md)


### FAQ
#### 1、用 typescript 写 node 程序没有类型智能提示？
使用nodejs标准库的某个函数时，可能忘记具体怎么使用了，又不想到官网去查API，我们期望 vscode 给出函数原型，提供给我们这些信息： 函数功能是什么，函数的参数具体长什么样，该函数用法举例。

具体来说，如果你在vscode 直接书写如下代码，鼠标悬浮在 `createHttpServer` 上时，你得不到任何提示：
```js
const http = require("http")

http.createServer((req, res) => {})
```

如何给出提示呢？
```bash
$ pnpm install -D @types/node
```
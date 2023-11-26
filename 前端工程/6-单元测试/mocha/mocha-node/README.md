## 配置
mocha自身的配置： `.mocharc.js`

## 介绍 
本demo展示如何用tsc编译器处理ts，从而支持用ts编写mocha单元测式文件

本项目中，没有使用ts-node工具，而是采取先编译为js文件，然后用 mocha 执行 
的思路

利用这种方式，可以得到单元文件的结果，但是无法在vscode里调试单元测式文件，你可以 
使用 `pnpm run test:debug` 尝试在 node inspector 里调试
> 无法调试的原因是，执行单元测试文件的时候，并不是按照nodejs模块加载的方式执行的

## 类型提示
在 ts 单元测试文件中，要使用 `describe` 函数，必须下载 `@types/mocha`；

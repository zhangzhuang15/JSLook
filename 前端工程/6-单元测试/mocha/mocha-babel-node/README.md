## 介绍
使用 babel 处理 ts，令 mocha 支持 ts版本的单元测试文件

采用这个方式，只管写ts代码即可，你不会看到有任何js文件产生；我们
用的是 @babel/register 做运行时 ts -> js 的转换，你也可以使用
@ts-node/register 做同样的事情，不过根据 babel 和 tsc 编译代码 
的特点，我们使用 babel 会更快一些，我们将 tsc 用于两个方面：
- 类型检查
- 输出声明文件

整个项目来源于：https://github.com/mochajs/mocha-examples/tree/master/packages/typescript-babel

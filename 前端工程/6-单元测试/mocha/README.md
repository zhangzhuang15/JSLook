## 注意事项
### commonJS 优先
如果源代码使用 esModule 风格开发，无所谓了，但是单元测试代码优先使用 commonJS 风格，
尽管 node 支持 esModule，但该风格下，mocha的表现不稳定。

## FAQ
### 源代码是按照 es6 模块化组织的，单元测试代码使用require引用模块，会产生引入冲突

`npm install -D @babel/register`

指定 mocha --require选项，设置为 @babel/register, 就可以在执行 require 时，将引入的模块及时编译为 commonJS风格，供 node 环境使用。

> 其他单元测试框架类似，要阅读官方介绍

如果在单元测试文件中，使用路径alias，需要安装 `tsconfig-paths`, 指定 `--require tsconfig-paths/register`
> --require 可以指定多次，最终结果是一个列表，不会彼此覆盖

路径alias就是指
```ts
// import { tool } from "src/utils/tool"

import { tool } from "@/tool"
```

<br>

如果单元测试文件本身使用 ts 编写的，想覆盖掉项目的ts配置，可以为 mocha 传入环境变量`TS_NODE_PROJECT`指定ts配置文件，传入`TS_NODE_COMPILER_OPTIONS`环境量配置 ts 配置文件的 `compilerOptions`中的值；

[更多参考](https://github.com/mochajs/mocha-examples/tree/master/packages/typescript)

### 在vscode用ts写单元测试代码的时候，为什么找不到 `describe`函数的 type hint
因为没有安装 `@types/mocha`
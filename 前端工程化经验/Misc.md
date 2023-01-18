# 指导

## 下载项目

在使用 git clone 把本项目拷贝到本地后，你需要：

1. 按照 package.json 中的 `engines` 和 `packageManager`，准备好合适版本的 node 和 yarn.
2. 执行 yarn
3. 点击 vs code 左下角的齿轮，打开 setting，确认几件事情：
   - editor.defaultFormatter: Prettier Eslint
   - editor.save: Format On Save ✅
     这将保证你在保存文件的时候，自动格式化代码，保证代码风格统一。

## 添加新代码

## 编写单元测试代码

## 调试单元测试代码

1. 把 .vscode/launch.json 文件中的 `"runtimeExecutable"`字段值，替换为你本地的 node 路径。
   > `whereis node` 可查看；
   > 使用`nvm`的话，可以直接用`env`命令查看终端环境变量 PATH；
2. 在你的测试文件中，直接打上断点；
3. 选中 vscode 的最左边一列的调试图标，选中 `Debug Mocha tests`;

**注意**
断点标注在被测试模块内的文件是无效的。
比如：
你要测试 module/tool/add.ts 代码中的函数，在 test/module/tool/add.spec.ts 中测试该函数。如果你把断点标注在 module/tool/add.ts 中，是不会生效的。

<br>
<br>
<br>

## 补充说明

### package.json

#### FAQ🤔

##### 1. `--configPlugin typescript2` 干什么用的？

在 package.json 中你会看到 :

```json
{
  ...
  "scripts": {
    ...
   "build:cjs": "npm run build:dts && rollup --config --configPlugin typescript2 --environment Target:cjs",
    ...
  }
}

```

`--configPlugin typescript2` 是帮助 rollup 读取配置文件的。

默认情况下， rollup 无法识别 rollup.config.ts 文件，只能识别 rollup.config.js 文件。

指定 `--configPlugin`， 告诉 rollup， 使用 `typescript2` 这个 rollup 插件去识别 ts 版本的配置文件。

该插件在 `devDependencies` 中可以看到: `rollup-plugin-typescript2`

##### 2. 为什么不使用 pnpm ？

最开始搭建本项目的时候，使用的是 yarn，主要考虑到 `postinstall` `preinstall` 等 scripts 的执行问题，经过在 pnpm 官网搜索，发现 pnpm 默认不会执行 用户自定义 的 `pre-script` 和 `post-script` , 对于 `postinstall` 这样内置的 `pre-script` 和 `post-script`， 还是会执行的。因此，后续会考虑在主体代码稳定后，使用 pnpm 替换 yarn。
refer: https://pnpm.io/cli/run#differences-with-npm-run

##### 3. `exports` 有什么用 ？

先看一下这个字段的值

```json
{
  "exports": {
    ".": {
      "import": {
        "node": "./dist/main.umd.js",
        "default": "./dist/main.esm.js"
      },
      "require": {
        "node": "./dist/main.umd.js"
      },
      "types": "./types/main.d.ts"
    },
    "./*": {
      "require": "./dist/*.js",
      "import": null,
      "types": "./types/*.d.ts"
    }
  }
}
```

当上层浏览器 app 使用 `import tool from '@focus/focus-utils-ts'` 导入我们的包时，导入的就是 `./dist/main.esm.js`;

当在 node 环境中使用 `import tool from '@focus/focus-utils-ts'` 导入我们的包时,导入的就是 `./dist/main.umd.js`;

当在 node 环境中使用 `const tool = require('@focus/focus-utils-ts')` 导入我们的包时，导入的就是`./dist/main.umd.js`;

上述情形中，`tool` 的类型提示来自于`./types/main.d.ts`;

<br>
<br>

当上层浏览器 app 使用 `import { lastIndexOf } from '@focus/focus-utils-ts/array/lastIndexOf'`导入某个工具函数时，由于我们设置了`import: null`， 就会报错，找不到我们的包；

当在 node 环境中使用 `const { lastIndexOf } = require('@focus/focus-utils-ts/array/lastIndexOf')` 引入某个工具函数时，就会导入 `./dist/array/lastIndexOf.js`， 其类型提示来自于 `./types/array/lastOf.d.ts`.

之所以在 exports 中引入

```json
 "./*": {
      "require": "./dist/*.js",
      "import": null,
      "types": "./types/*.d.ts"
    }
```

是考虑到 node 环境 require 会把整个对象加载，浪费内存，加入这个设置，就可以按需加载；

**注意**，构建工具、打包工具 或者 loader 程序 在搜索 module 的时候，必须按照 node 搜索 module 的方式，否则 `exports` 字段不会生效！

比如`tsc` 的配置文件 `tsconfig.json`，就给出了搜索 module 的方式：

```json
{
  "compilerOptions": {
    "moduleResolution": "NodeNext"
  }
}
```

之所以不设置为 "Node"， 是因为此时 vscode 类型提示系统不会识别`exports` 字段，从而无法获取到类型定义，导致写代码的时候，丢失类型提示！

当然如果你在写 js 代码，发现没有类型提示，但是被调用的包已经在其 package.json 中定义好 exports 字段，那么你就要在项目中加入 `jsconfig.json`来解决该问题，配置参数和`tsconfig.json`相同，只不过是让 vscode 作用在 js 文件上。

补充一点，如果 node 版本较低，无法识别 `exports`字段，就会采用 `main`字段，这就解释了有些情况下`main`字段覆盖掉`exports`。

#### 4. `engines`字段规定 node 版本号真的有用？

不同的包管理器，有不同的处理方式。

如果 node 版本号不符合要求时：

yarn：yarn 进程立即 crash；
pnpm: 打印出正确的 node 版本号，程序继续执行；
npm： 程序继续执行；

#### 5. 执行 `yarn link` 时， `files`字段为什么不生效？

当你使用 yarn add 下载一个包后，你会发现 node_modules 中该包的文件和其 github 上的源码不同，你能看到的文件刚好就是源码 package.json 中 `files` 规定的那些文件；

而采用本地安装 npm 包时，比如下述方式：

1. `npm link` `yarn link` `pnpm link`;
2. package.json
   ```json
   {
     "dependencies": {
       "tool": "file:../packages/tool"
     }
   }
   ```

包管理器只会创建一个符号连接到包的源码，因此在 node_modules 中你看到的包就是包的源码；(stackoverflow 有相应的问题讨论)

此时就有了 `files`字段不生效的现象。

如果破解呢？
采用 Git URL 方式安装包, 在没有 publish 的情况下，激活`files`
package.json

```json
{
  "dependencies": {
    "tool": "git://github.com/xxx/tool.git#v1.3.0"
  }
}
```

### tsconfig.json

1. 主流的浏览器已经支持 es6 语法标准，因此设置 `target: 'ES6'`，生成 es6 语法规范的 js 代码
2. 因为要运行在浏览器环境，同时 node 也支持 es module 模块化方式，因此设置 `module: "ESNext"`
3. tsc（typescript 编译器程序） 编译 ts 代码，遇到 import 语句，需要寻找模块，我们指定 `moduleResolution: "nod"`，按找 node 寻找模块的思路解析；
4. 编译 ts 代码时，可能会找不到一些类型声明，指定`types: ["node"]`， 告诉 tsc 如果不知道类型，就去`node_module/@types/node`去查；
5. 并不是所有的 ts 文件需要编译，指定 `exclude`，告诉 tsc 有哪些文件不需要编译；

更详细的配置请前往 https://aka.ms/tsconfig

tsc 起到什么作用？

1. 帮助我们生成 .d.ts 声明文件，存储到 dist 文件夹；
2. 帮助我们将 ts 代码编译成 js 代码；

#### FAQ🤔

##### 1. 配置文件设置模块化方式是 ESNext, 那么 common JS 风格的代码是不是没办法生成了 ？

不要担心。

除了生成 .d.ts 声明文件，typescript 编译器并不会直接去生成 js 代码，这一点在 package.json 中的 `scripts` 可以看到，我们没有直接用 `tsc` 生成 js 代码。

在生成 js 代码的路上，typescript 编译器由 rollup 的 typescript 插件驱动，编译 ts 代码。在 rollup 的配置文件`rollup.config.ts`中可以看到，在编译成非 cjs(commonJS) 风格的代码时，我们将 ts 的 module 配置改写为 ES5，在 node 环境中，是支持 es6 语法的，因此 cjs 情况下依旧使用的是 es6.

经过 ts 编译之后，得到的 js 代码又会被 rollup 处理，再次生成为其他模块化格式的 js 文件。

---

### mocha

#### FAQ🤔:

##### 1. 为什么 package.json 的 scripts 的 test 指令中， mocha 前边要加入一步环境变量的修改 ？

mocha 本身无法在 ts 环境下执行，需要使用 ts-node 加以执行。

`TS_NODE_PROJECT='test/tsconfig.json'`:
设置 ts-node 在执行时所采用的 ts 配置文件。
这个环境变量并不是由 `ts-node/register` 直接处理，而是由 `tsconfig-paths/register` 在运行时处理, 进而重定向 ts-node 采用的配置文件。
因此，要在 mocha 的配置文件`.mocharc.json`的 require 里，加入运行时 `tsconfig-paths/register`。
参考： https://www.jianshu.com/p/93414762a836

> 哦，别忘了，`tsconfig-paths`独立于 `ts-node`, 需要单独安装；

为什么要重定向 ts 配置文件呢？
为了在单元测试文件中，使用 module 名 alias 解析。  
比如`test/object/objectToString.spec.ts`：

```ts
import assert from "node:assert";
import { objectToString } from "@/object";

describe("object  #objectToString", function () {
  let data = {};

  beforeEach(function () {
    data = { name: "Mercy", age: 3, sex: 1 };
  });

  it(`should return "name=Mercy&age=3&sex=1"`, function () {
    const result = objectToString(data);

    assert.deepStrictEqual(result, "name=Mercy&age=3&sex=1");
  });

  ...
});
```

在引入 `objectToString` 的时候，路径名指定的是 `@/object`， 这个需要在 ts 配置文件的 `paths` 配置，告诉 ts-node 在执行代码的时候，如何寻找 module 真实路径。

<br>

`TS_NODE_COMPILER_OPTIONS='{\"module\": \"commonjs\" }'`：
ts-node 在执行的时候，对于 module 的解析，默认使用 commonJS 风格，但是在单元测试文件中，我们对模块的引入采取的是 ESModule 的风格，因此需要告诉 ts-node，在运行阶段，把 ESModule 的风格转换为 commonJS 风格，从而正确地解析模块，这个环境变量就是干这个用的。

> 这个环境变量是由 `ts-node/register` 直接处理的

关于使用 ts 完成 mocha 单元测试的编写，更多参考：https://github.com/mochajs/mocha-examples/tree/master/packages/typescript

---

### eslint

为了检测 ts 的语法错误，以及支持代码风格格式修正，需要安装如下依赖：

- eslint
- prettier
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint-plugin-prettier
- eslint-config-prettier

结合 eslint 配置文件做个说明：

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

明显能看出来的配置关系，就不再赘述了。

> `plugin:prettier/recommended` 来自 `eslint-plugin-prettier`  
> `plugin:@typescript-eslint/recommended` 来自`@typescript-eslint/eslint-plugin`  
> `eslint:recommended` 来自 eslint 内置  
> plugins 的 `@typescript-eslint` 就是指 `@typescript-eslint/eslint-plugin`  
> plugins 的 `prettier` 就是指 `eslint-plugin-prettier`

没有 `eslint-config-prettier`的事儿？
Answer:  
 在 `plugin:prettier/recommended`存在黑魔法，它会往 extends 字段中加入 `prettier`, 这个配置来自于`eslint-config-prettier`, 因此实际上还是用到了。参考 https://www.npmjs.com/package/eslint-plugin-prettier
💥 如果没有 `eslint-config-prettier`，无法在 vscode 自动保存文件时，格式化文件（比如修正代码缩进问题）

---

### husky

#### 小故事

原本想参考 vue 项目的 package.json:

```json
{
    ...
    "gitHooks": {
        "pre-commit" : "lint-staged"
    },
    "devDependencies": {
        ...
        "yorkie": "^2.0.0"
    }
}
```

避免使用 `husky`。
原本以为 `"gitHooks"`是 package.json 新增的内置特性，结果打脸了。

`"yorkie"`是 Evan You 从 GitHub 上 fork husky 项目 的产物，做了一些定制化的修改，而`"gitHooks"`正是 `"yorkie"`要用到的字段，属于 package.json 第三方字段！

😅 老老实实用 husky 吧 ！

#### 新版和旧版 husky

最大的区别是 `新版（>=6.0.0）`不再默认实现所有的 git hook， 于是你不能在 package.json 中如下配置：

```json
{
    ...
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    }
}
```

在老版本中，如果你只配置了 "pre-commit" hook, husky 依旧会检查其它 hook, 实际上，这是一种浪费。

详情参考 https://zhuanlan.zhihu.com/p/366786798

#### 舍弃 husky

因其它需求，被迫浏览 vite 源码时，发现项目用 `simple-git-hooks` 取代 `husky`, 于是考虑借鉴一下，放弃 husky；

😕：husky 在 package.json 中给出配置之外，还要使用 husky 指令激活当前 git 仓库，理想情况下，我们需要一个工具，安装它之后，给出配置内容，everything will work，无需手动做任何事情。

😍：`simple-git-hooks`支持按需引入 `git-hooks`，一次配置即可工作；

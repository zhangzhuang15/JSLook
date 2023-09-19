[toc]

---

`tsconfig.js` `tsconfig.json`

### 使用 tsc 去做什么？
tsc（typescript 编译器程序)

1. 帮助我们生成 .d.ts 声明文件，存储到 dist 文件夹；
2. 帮助我们将 ts 代码编译成 js 代码；


### target
主流的浏览器已经支持 es6 语法标准，因此设置 `target: 'ES6'`，生成 es6 语法规范的 js 代码

### module
因为要运行在浏览器环境，同时 node 也支持 es module 模块化方式，因此设置 `module: "ESNext"`

#### esnext 和 es2020 的区别
esnext是指ECMAScript的下一个版本，即将发布或正在开发中的版本。它包含了即将的新特性和功能，但尚未正式发布。ESNext可以被视为一个动态的、不断演进的版本，它可能包含了ES2020`中的特性，同时还可能包含其他尚未确定的特性。

es2020是ECMAScript的第10个版本，于2020年发布。它了一些新的语言特性和功能，如可选链操作符（Optional Chaining）、空值合并操作符（Nullish Coalescing）、BigInt类型等。

如果说你的代码一直想保持ECMAScript最新特性，使用 ESNEXT。


### moduleResolution
决定了编译器按照怎样的算法寻找被引入的模块。

#### `classic`
默认值，不过该值已经不适合主流，不要使用了。
```ts 
// /demo/A.ts 
import { B } from "./B"
```
会依次尝试寻找：
- `/demo/B.ts`
- `/demo/B.d.ts`

```ts 
// /demo/Hello/A.ts 
import { B } from "B"
```
会依次寻找：
- `/demo/Hello/B.ts`
- `/demo/Hello/B.d.ts` 
- `/demo/B.ts` 
- `/demo/B.d.ts` 
- `/B.ts` 
- `/B.d.ts` 

#### `Node`
必须指定 `module: "CommonJS"`, 否则在运行时会报错
```ts 
// /demo/Hello/A.ts 
import { B } from "./B"
```
依次寻找:
- `/demo/Hello/B.ts`
- `/demo/Hello/B.tsx`
- `/demo/Hello/B.d.ts` 
- `/demo/Hello/B/package.json`(访问 "types" 字段)
- `/demo/Hello/B/index.ts` 
- `/demo/Hello/B/index.tsx`
- `/demo/Hello/B/index.d.ts`


```ts 
// /demo/A.ts 
import { B } from "B"
```
依次寻找:
- `/demo/node_modules/B.ts` 
- `/demo/node_modules/B.tsx`
- `/demo/node_modules/B.d.ts` 
- `/demo/node_modules/B/package.json`(访问"types"字段)
- `/demo/node_modules/@types/B.d.ts`
- `/demo/node_modules/B/index.ts` 
- `/demo/node_modules/B/index.tsx`
- `/demo/node_modules/B/index.d.ts` 
- `/node_modules/B.ts` 
- `/node_modules/B.tsx`
- `/node_modules/B.d.ts` 
- `/node_modules/B/package.json`(访问"types"字段)
- `/node_modules/@types/B.d.ts`
- `/node_modules/B/index.ts` 
- `/node_modules/B/index.tsx`
- `/node_modules/B/index.d.ts` 

#### `Node16` or `NodeNext` 
##### `module: "CommonJS"`
```ts 
// /demo/Hello/A.ts 
import { B } from "./B"
```
寻找方式，和 `Node` 情形一样。

```ts 
// /demo/A.ts 
import { B } from "B"
```
依次寻找：
- `/demo/node_modules/B.ts` 
- `/demo/node_modules/B.tsx`
- `/demo/node_modules/B.d.ts` 
- `/demo/node_modules/B/package.json`(优先访问"exports"字段，后访问"types"字段)
- `/demo/node_modules/@types/B.d.ts`
- `/demo/node_modules/B/index.ts` 
- `/demo/node_modules/B/index.tsx`
- `/demo/node_modules/B/index.d.ts` 
- `/node_modules/B.ts` 
- `/node_modules/B.tsx`
- `/node_modules/B.d.ts` 
- `/node_modules/B/package.json`(优先访问"exports"字段，后访问"types"字段)
- `/node_modules/@types/B.d.ts`
- `/node_modules/B/index.ts` 
- `/node_modules/B/index.tsx`
- `/node_modules/B/index.d.ts` 

##### `module: "ESNext"`
其他esModule选项也一样，这里选择`ESNext`去解释

```ts
// /demo/Hello/A.ts 
import { B } from "./B"
```
这样写是非法的，要求你给“./B”补全文件后缀`.js`，写成`"./B.js"`

写成`"./B.js"` 之后，依旧可以在 `A.ts` 中拿到 `B.ts` 中的类型信息，不影响你编写代码。

只是在运行的时候，需要用typescript编译器全部编译一遍，然后再用node执行。

不能用 ts-node 直接执行 ts 文件。

在typescript编译的时候，tsc 不会对引用的路径做修改，你写代码的时候是什么样，编译出来的结果就是什么样。


```ts 
// /demo/A.ts 
import { B } from "B"
```
这个情形和上边 `module: "CommonJS"` 一样


#### `Bundler`
采用这种方式，编写 ts 代码不会有什么问题，但是不能用 tsc 编译，或者用 ts-node 执行。必须用 bundler 处理它。

##### `module: "CommonJS"`
这个情况和`NodeNext`一样。

##### `module: "ESNext"`
```ts
// /demo/Hello/A.ts 
import { B } from "./B"
```
这个情况和 `NodeNext` 的 `module: "CommonJS"` 一样，而且不要求你加`.js` 后缀，如果在这里是指 `B.ts`， 你写成 `"./B"` `"./B.js"` `./B.jsx` 都是可以的。

```ts 
// /demo/A.ts 
import { B } from "B"
```
这个情形和上边`NodeNext`一样

TS官网链接: https://www.typescriptlang.org/docs/handbook/module-resolution.html

### types
书写 ts 代码时，尽管你没有显示引入某些 .d.ts，但你依然可以得到一些类型提示，是因为node_modules/@types/
下所有的 `类型package` 会自动引入，但是你想引入其中几个的话，就可以设置这个配置。比如指定`types: ["node"]`， 
告诉 tsc，你只需要引入`node_module/@types/node`去查；

> 类型package，意思是package中全部是 .d.ts，没有.ts， package.json 中 main 字段是空字符串，types 字段非空

### typeRoots
如果你不想在 `./node_modules/@types` `../node_modules/@types` ... 下引入类型信息，你可以指定 typeRoots 
改变这个行为，比如设置 typeRoots 为 ["./typings", "./types"], 没有显示引入的类型信息，就会自动在 "./typings"
和 “./types” 目录下的各个package里寻找。

### exclude
并不是所有的 ts 文件需要编译，指定 `exclude`，告诉 tsc 有哪些文件不需要编译；

### paths 
定义模块路径别名。tsc babel ts-node 不会根据这个配置项，用实际路径替换掉别名。这个配置项是给 bundler 用的。

### more
更详细的配置请前往 https://aka.ms/tsconfig

### FAQ
#### 1、怎么去理解module字段？
该参数就是指定 tsc 编译器产出何种 module 管理风格的js代码；

如果指定 `CommonJS`, 在最终代码产物中，你会看到 `require` 函数，看不到 `import`;

如果指定 `ES2015`，在最终代码产物中，你会看到 `import` ， 看不到 `require`;

这仅仅是模块管理形式上的一个语法变化。

但是，如果涉及到 node标准库模块 的引入，指定哪种风格全在于 `node` 理解哪种风格； 

默认状况下，node只能识别 CommonJS，因此编译的结果，你不得不采用 CommonJS ;
> node 也识别 `.mjs`, 在该文件中，你可以使用 esModule 风格的模块管理；

同理，浏览器只能识别 esModule 模块管理风格的代码，因此编译的结果，你不得不采用 ES2015 之类的风格；
> ESNext， ES2016 等等


ts 所做的一件好事就是在编码阶段统一为 import 风格，在编译阶段再转化为具体环境所支持的风格；

#### 2. 想在import的时候，模块名位置处不写.ts，应该怎么实现？
- 正确设置好`include`配置；
- 开启`allowImportingTsExtensions`配置；

之后就可以引入common.utils.ts文件了：
```ts{.line-numbers} 
import { hello } from "./common.utils";
```

> 不要使用`moduleSuffixes`，该配置已经作废了

#### 3. import x from module的时候，想使用alias的方式表示module，怎么实现？
设置 `path`配置，比如：
```json{.line-numbers}
{
    "compilerOptions": {
        "path": {
            "@component/*": ["./src/component/*"]
        }
    }
}
```

#### 4. 如何直接用import引入一个json文件？
开启`resolveJsonModule`

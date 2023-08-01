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
tsc（typescript 编译器程序） 编译 ts 代码，遇到 import 语句，需要寻找模块，我们指定 `moduleResolution: "NodeNext"`，按找 node 寻找模块的思路解析, 同时保证可以识别 package.json 中的 `exports`；

### types
编译 ts 代码时，可能会找不到一些类型声明，指定`types: ["node"]`， 告诉 tsc 如果不知道类型，就去`node_module/@types/node`去查；

### exclude
并不是所有的 ts 文件需要编译，指定 `exclude`，告诉 tsc 有哪些文件不需要编译；

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


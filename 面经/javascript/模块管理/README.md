## CommonJS  ESM UMD AMD CMD 都是什么？
javascript最开始的时候，只有语法规范，并没有模块管理的概念。毕竟javascript是运行在浏览器中的简单脚本。可是随着浏览器技术的迭代，前端项目工程化，代码量剧增，把所有的代码写在一个文件中已经不适合了，于是模块化的概念应运而生。

问题中的几个词，都是指模块化的标准规范。不同规范下，实现的思路是不一样的。

CommonJS常见于nodejs。CommonJS的标志就是"require"关键字，其引入方式是值拷贝，而且加载模块是同步的。

ESM常见于浏览器端，被广大浏览器厂商所支持。ESM的标志就是"import" 关键字，html 中 `type="module"` 的`<script>` 标签，其引入方式是引用拷贝。

CMD, Common Module Definition, 代表库是sea.js, 既可以同步加载模块，也可以异步加载模块，推崇依赖就近。

AMD，Asynchronous Module Definition, 借助require.js运行时库，异步加载模块，用于浏览器端。AMD的标志就是"define"和 “require” 关键字。require.js实际上，就是动态创建\<script\>标签来加载js的。

UMD， Universal Module Definition, 就是一种大杂烩，采取兼容写法，将 Common JS ESM CMD AMD 全部兼容进去。
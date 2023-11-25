import { hello } from "@/utils"
import { add } from "./utils/add"
import { fileURLToPath } from "node:url"

import('@/utils').then(({ hello }) => {
    hello();
})
//hello()

const t = add(1, 2)
console.log("1 + 2: ", t)

/**
 * 最终生成的代码是 esmodule 形式的，不能直接使用commonJS的
 * require，需要这样变通解决下。
 */
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const Bobby = require("./data.json")
console.log("Bobby: ", Bobby)

// 这样写尽管没有报错，但是在运行时无法通过
// console.log(__filename)

/**
 * 编译结果是EsModule情况下，无法使用__filename，
 * 可以这样获取：
 */
console.log("__filename: ", fileURLToPath(import.meta.url))












/**
 * 很遗憾，当把ts代码转化为 esModule js 代码后，无法直接用
 * ts-node执行，会报错。
 * 
 * 具体说下报错情况：
 * 如果将 `moduleResolution` 设置为 `NodeNext`的话，在引用 hello 就会
 * 报出 ts 的错误，因为在这种模式下，引用的路径需要带有合法的文件后缀 .js，
 * 写成 "./utils" 是不可以的。
 * 但是，你可以补全 .js 后缀，然后用 tsc 先编译，再用 node 执行。补全 .js
 * 后缀，写代码的时候依旧可以看到模块的类型提示信息。
 * 
 * 如果将 `moduleResolution` 设置为 `Node` 的话，不会报出 ts 的错误，但是
 * 在使用 ts-node 运行会报错，因为它无法将 "./utils" 解析为 "./utils/index.ts"，
 * 如果先用 tsc 编译代码，再用node执行编译好的代码，编译出来的文件依旧是从 "./utils"
 * 引用 hello 的， 如果用 node 执行，还会因为没有 .js 扩展名的原因失败，我们
 * 自然也不能手动给 "./utils" 修正为 "./utils/index.js"。
 * 
 * 这里使用 `moduleResolution` 为 `Bundler`，然后用 rollup 去处理
 * 在处理的时候，要设置 rollup 的 output.manualChunks，否则 “utils/index.ts”
 * 就会打包进入 index.ts, 这不是我们想要的，我们要让 "utils/index.ts" 在
 * 单独的 js 文件里，由index.js引入
 * 
 * 还有一个细节是 package.json 的 type 设置为 `module`，这样做的好处是，不用将
 * 编译好的代码重命名为 .mjs 扩展名
 */
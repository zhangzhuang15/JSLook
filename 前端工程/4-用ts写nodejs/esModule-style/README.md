## Get Started 

### Bundler 
用Bundler来执行代码，只需要：
```sh 
$ pnpm build
$ node dist/index.js
```

index.ts:
```ts{.line-numbers} 
import { hello } from "./utils"
import { add } from "./utils/add"
import { fileURLToPath } from "node:url"

// 剩余代码省略
```

tsconfig.json:
```json{.line-numbers} 
{
    // minimum configs
    "compilerOptions": {
        "target": "ESNext",
        // generate esmodule code ran by Node, don't use "NodeNext",
        // it will output codes in commonJS format.
        "module": "ESNext",
        // we use bundler rollup to deal with .ts file,
        // so choose "Bundler";
        "moduleResolution": "Bundler",
    },
    "include": ["index.ts", "./utils/*.ts", "rollup.config.ts"]
}
```

### Node 
使用 Node 去运行

`node version >= 16`

请调整下面相关文件：

index.ts:
```ts{.line-numbers} 
import { hello } from "./utils/index.js"
import { add } from "./utils/add.js"
import { fileURLToPath } from "node:url"

// 以下代码不用改，就省略不写了
```

tsconfig.json:
```json{.line-numbers} 
{
    // minimum configs
    "compilerOptions": {
        "target": "ESNext",
        // generate esmodule code ran by Node, don't use "NodeNext",
        // it will output codes in commonJS format.
        "module": "ESNext",
        // we use bundler rollup to deal with .ts file,
        // so choose "Bundler";
        "moduleResolution": "NodeNext",
    },
    "include": ["index.ts", "./utils/*.ts"]
}
```

然后只需:
```sh 
$ tsc --outDir out
$ cp data.json ./out/data.json
$ node out/index.js
```

### 关于 import() 
如果你写成`import("./index")`, 使用bundler处理时，bundler在一些插件的加持下，会对“./index”有自己
的解析，“./index”就被解析为 "./index.js" or "./index.cjs" or "./index.mjs" 等等，生成的bundle
文件里，路径就带有文件扩展名，node执行的时候，就不会出现未能找到package的情况。

反之，如果你让node直接执行`import("./index")`， node 不会自动确定文件扩展名，会直接报错！


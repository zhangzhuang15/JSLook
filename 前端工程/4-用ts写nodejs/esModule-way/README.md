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


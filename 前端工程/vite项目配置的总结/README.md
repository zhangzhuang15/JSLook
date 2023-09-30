[toc]

## 创建vite项目
```sh 
$ pnpm create vite
```

## css module 
vite默认支持。

作为css module 的文件，必须命名为 `*.module.css` 的形式

如果要支持 `*.module.less`, 需要`pnpm install -D less`

如果要支持 `*.module.scss`, 需要`pnpm install -D sass`

---

在ts文件中，`styles`没有类型提示：
```ts 
import styles from "./app.module.less"

// styles后边输入 . 的时候，vscode不会给出 app 的提示
styles.app
```
解决方式：
```sh 
$ pnpm install -D typescript-plugin-css-modules
```
```json 
/* tsconfig.json */

{
    "compilerOptions": {
        "plugins": [
            {
             "name": "typescript-plugin-css-modules "
             }
        ]
    }
}
```
```json 
// your vscode workspace settings.json 
{
    /* your local typescript path */
    "typescript.tsdk": "node_modules/typescript/lib"
}
```
你的项目更目录作为 workspace，在vscode中打开
[toc]

## 官网 
[visit](https://cn.vitejs.dev/guide/api-hmr)

## 底层基础
vite建立在 rollup esbuild 基础上，vite的配置项会涉及到 rollup 配置项;

vite创新之处在于模块更新的方式上，文件更新之后，网页会通过 import 语法触发
一次请求，接收到请求之后，会使用esbuild快速编译更新，回传给网页，达到热更新
的效果。

而webpack更新的方式，是把整个项目重新编译一遍，回传给网页。

## 配置 
- vite.config.js 
- vite.config.ts

配置内容无需死记硬背，查看官网慢慢配置即可

## 安装
```sh 
$ pnpm create vite
```
安装 vite，并且使用 vite 作为脚手架创建一个项目

## FAQ 
### vue SFC中怎么使用 `scss` `less`
在vite加持下，开发vue SFC, 只需要确保安装好 `sass` `less`就可以了，无需配置！

在 `<style>` 中使用时，要加入 lang 属性：

```html
<style lang="scss"></style>
<style lang="scss" scoped></style>
```

### vue SFC中怎么使用 `css module` 
vite默认支持。

作为css module 的文件，必须命名为 `*.module.css` 的形式

如果要支持 `*.module.less`, 需要`pnpm install -D less`

如果要支持 `*.module.scss`, 需要`pnpm install -D sass`

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
你的项目根目录作为 workspace，在vscode中打开

### `base` and  `publicDir` ?
其实不光 vite 中有这两个配置项，在 webpack\rollup也会有等价的配置项，可能命名不同，但他们表示的意思是一样的。这里就以vite为例，去解释。
> webpack中，`output.publicPath` 等效于 vite 的 `base`

当执行 `vite build`，生成的代码一般指定放置在与`src`目录同级的`dist`目录下。

然后我们会把`dist`目录放到服务器，用`nginx`配上路由，就可以访问了。

不妨假设部署的服务器域名为 `hh.com`, 项目目录整体有如下结构：
```txt
Project
|
├ㄧ dist
|    ├ーー index.html 
|    ├ーー logo.ico
|    └ㄧー assets
|            └ㄧー index.oo989rer.js
|
├ㄧ src
|    └ㄧㄧ main.js 
|    
|
├ㄧ public
|    └ㄧㄧ logo.ico
|
└ㄧ index.html
```
`Project/index.html`大致如下：
```html 
<!DOCTYPE html>
<html lang="en">
    <head></head>
    <script src=“/src/main.js”></script>
    <body>
        <div id="app"></div>
    </body>
</html>
```

#### base
不同情况下，看看`base`带来的不同结果，你就能理解这个值的意思了：

1. 默认情况下，`base`的值是`/`, 这样生成的 `Project/dist/index.html`中，src的属性值就是 `/assets/index.oo989rer.js`；

2. 将 `base`的值改为`/app`，这样生成的`Project/dist/index.html`中, src的属性值就是 `/app/assets/index.oo989rer.js`;

3. 将 `base`的值改为`./`, 这样生成的`Project/dist/index.html`中，src的属性值就是`./assets/index.oo989rer.js`;

第一种情况，`Project/dist/index.html`的nginx路由要匹配 `http://hh.com/`；

第二种情况，路由就要改为`http://hh.com/app/`；

第三种情况，路由就没有这样的要求，因为它是`./`开头，相对于页面当前路由而言的，没有`/` 或 `/app`的前缀限制，设置为`http://hh.com/` `http://hh.com/app/` `http://hh.com/app/yy`等等都可以。

一旦设置好`base`，vite在build的时候，会据此对`import` `url()`以及 html文件相关属性值(href, src)做路径调整。

#### publicDir

依旧是上面的例子，你一定注意到了`Project/dist/logo.ico`文件。

这个文件，不是在dist文件夹生成后，再被开发人员添加的。

它也不是 vite 生成 dist 文件夹的时候，生成的。

**它是vite生成dist文件夹的时候，从别的文件夹里copy过去的**。

哪个文件夹呢？

就是`publicDir`指定的文件夹。默认情况下，指的就是`public`文件夹。
> **如果是相对路径，则相对于项目根目录而言**

在vite build的时候，该文件夹下面的所有文件会直接被copy到`Project/dist`中。

如果在 `Project/index.html`中引用public文件夹下的`logo.ico`，那么路径应该是`/logo.ico`，而不是`/public/logo.ico`。请牢记这一点，这和`base`无关。

同时，不要用js的 `import`，引入public文件夹下的文件。
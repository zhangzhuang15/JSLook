#### private
如果：
* 你的项目不会发布到npm上，只会通过打包工具生成最终执行的代码部署到服务器上；
* 你的项目是多package管理的根项目，各个package要发布到npm上，根项目无需发布
   > 这个情形下，你还要指定 workspace，交代多个 package 分布在哪些文件夹下，一般都是放在一个叫 packages 的文件夹下。

private应该等于 true

#### workspace 
```json
{
   "name": "packageA",
   "private": true,
   "workspace": [
      "./package/*"
   ]
}
```
表示package文件夹下的每个文件夹，都带有 package.json 文件，也就是说这些文件夹都是一个npm包。

#### engines
强烈建议设置此选项。当你搭起一个项目，设置好研发环境时，你安装依赖的库可能对node版本有要求。如果另外有一个人拉取你的项目，想做些贡献，很可能被本地node版本号坑到，无法顺利安装依赖库。通过engines指定好版本，可以提早给出提示，先行告知用户升级node。

不同的包管理器，有不同的处理方式。

如果 node 版本号**不符合要求**时：
yarn：yarn 进程立即 crash；
pnpm: 打印出正确的 node 版本号，程序继续执行；
npm： 程序继续执行；

#### main
当你开发的npm项目是一个库时，你要指定这一项，表明库的入口文件。这样，当别人npm install 你的库后，使用require引用你的库，node才知道应该引入哪个文件。

#### files
当你使用 `npm publish` 发布自己的npm项目时，实际上是将你项目中要发版的所有文件打包成 tar，然后将tar包上传到registry。别人 `npm install` 的时候，也是先下载这个 tar包，然后解压恢复成文件夹。  

`files`的作用就是告诉 `npm publish`, 项目中到底哪些文件要被打包。默认情况下，`.gitignore` `.git`等文件不会被打包。


**files 失效**
如果你开发一个包，在发版之前，你会想看看一个项目安装这个包后，使用效果如何，你会使用 `npm link`， 或者用本地路径作为依赖路径。

npm只会建立一个软连接到项目中，不会触发 files 字段，导致你开发的包的所有文件都被放进了 node_modules中。

解决方法一：使用 git 路径作为依赖路径
```json
{
  "dependencies": {
    "tool": "git://github.com/xxx/tool.git#v1.3.0"
  }
}
```
这里假设你开发的包名叫做 `tool`;

解决方法二： 使用 npm-packlist
```bash
$ cd <your-project>
$ npx npm-packlist
```
你将看到哪些文件会被发版
[本方法出处](https://snyk.io/blog/best-practices-create-modern-npm-package/)

解决方法三： 使用 npm pack 
进入项目根目录, `npm pack`, 生成一个 .tgz 文件；
进入引用该package的项目根目录，执行 `npm install <path-of-tgz>`;

#### type
指定你的npm项目采用哪种模块化管理方式，"module" 或者 "commonjs"，**只能二选一**！如果你指定了 “module”，可实际上代码用的是commonJS的方式，node会在执行的过程中报错，但是在vscode编码过程中不会报错。  
如果你没有指定type, 默认为 commonjs.
> 在 node v12.0.0开始，你可以用 module 的模块化管理方式，编写nodejs代码；
> 甚至在一个 .cjs 文件中用 commonjs的方式导出模块，在另一个.js代码中使用 module 方式导入；
> 对于 .cjs 文件，按照 commonjs 组织模块；
> 对于 .ejs 文件，按照 module 组织模块；
> 对于 .js 文件，按照 type 指定的模块化方式组织；

**注意：**
如果你在 .js 文件使用 module 方式导出，在另一个 .js 文件中使用 commonjs 方式导入，需要使用 @babel/register 这样的工具进行及时编译，否则报错！

#### types 
第三方工具所需字段。
这个字段供 typescript 使用。

如果你的库要供给typescript使用，需要为你的js库加入声明文件，而types就是指出声明文件的位置。

#### module
当别人用 module 模块化方式导入你的库时， module 将告诉 node 入口文件在哪里。

#### exports
node v14.13.0开始支持的字段, 版本低的，只会识别 main 字段。

exports 字段可以配置不同环境对应的模块入口文件，并且当它存在时，它的优先级最高。

node支持import 和 require。 利用 exports 导出的模块，可以 import；用export 导出的模块，不能require。

看个例子：
```json
{
   "name": "packageA",
   "exports": {
      ".": {
         "require": "./dist/main.common.js",
         "import": {
            "node": "./dist/main.m.js",
            "default": "./dist/main.esm.js"
         },
         "types": "./dist/types/index.d.ts"
      },
      "./package": null,
      "./css/*": "./dist/css/*",
   }
}
```
在node环境，使用`import "packageA"`,会引入 `./dist/main.m.js`;

在node环境，使用`require("packageA")`会引入`./dist/main.common.js`；

如果是 node + typescript 环境，使用 `import "packageA"`，会引入`./dist/main.esm.js`，声明文件从 `./dist/types/index.d.ts`去找;

如果开发一个web app，在 `import "packageA"`会引入 `./dist/main.esm.js`;

r如果`import "packageA/package"` 会报错“找不到模块”；

**注意**
构建工具、打包工具 或者 loader 程序 在搜索 module 的时候，必须按照 node 搜索 module 的方式，否则 `exports` 字段不会生效！

如何给出搜索 module 的方式？
`tsconfig.json`
```json
{
  "compilerOptions": {
    "moduleResolution": "NodeNext"
  }
}
```
之所以"moduleResolution"不设置为 "Node"， 是因为此时 vscode 类型提示系统不会识别`exports` 字段，从而无法获取到类型定义，导致写代码的时候，丢失类型提示！

如果你在写 js 代码，.d.ts文件也存在，被调用的包已经在其 package.json 中定义好 exports 字段，但就是没有类型提示。

你就要在项目中加入 `jsconfig.json`来解决该问题，配置参数和`tsconfig.json`相同。


#### packageManager
该字段告诉别人你使用什么包管理工具，但是这个字段并不会阻止别人用其它包管理工具。  
比如，package.json
```json
{
  "packageManager": "yarn@1.20.2",
  "scripts": {
   "dev": "node index.js"
  }
}
```
别人依旧可以正常执行`npm run dev`

可以搭配 `only-allow` package 和 `preinstall` package script 去限制使用指定的包管理器；

#### unpkg
这是第三方工具要在package.json中用到的字段，package.json本身并没有定义该字段。
`unpkg`指定入口文件。当用户使用unpkg官网的cdn向浏览器中导入npm包的时候，就会将`unpkg`指定的文件导入。
```json
{
   "name": "packageA",
   "unpkg": "./dist/main.esm.js",
}
```
若`<script src="http://unpkg.com/packageA" />`，就会将packageA项目中的`dist/main.esm.js`文件导入。


#### jsdelivr
第三方工具所需字段。  
`jsdelivr`指定入口文件。当用户使用jsdelivr官网的cdn向浏览器导入npm包的时候，就会将`jsdelivr`指定的文件导入。
```json
{
   "name": "packageA",
   "jsdelivr": "./dist/main.esm.js",
}
```
若`<script src="http://cdn.jsdelivr.net/npm/packageA" />`, 就会将packageA项目中的`dist/main.esm.js`文件导入。

#### browserslist
第三方工具所需字段。 

用于指定项目所支持的浏览器版本，一些插件会读取这个信息，完成 css 前缀补全、js polyfill功能。比如 babel插件，postcss-normalize插件, autoprefixer插件。 

当使用babel编译代码时，需要知道编译成和什么样的浏览器兼容的代码，此时babel就会读取package.json中的 `browserslist`字段。当然，你可以不用写在package.json中，单独放在`.browserslistrc`文件中。

package.json
```json
{
   "name": "packageA",
   "browserslist": [
      ">5%",
      "last 1 version"
   ]
}
```

#### sideEffects
第三方工具所需字段。
指定有副作用的文件有哪些，阻止webpack对这些文件的tree-shaking。
比如使用 webpack 打包的时候，如果 `import css from "packageA/css"` 引入某个包下面的css资源，可是webpack发现你没有使用，就不会把这些css资源打包，此时设置 `sideEffects: ["*.less", "*.scss", "*.stylus"]`，告诉webpack这些文件有副作用，别对它们使用tree-shaking。

#### lint-staged
第三方工具所需字段。
配置 `lint-staged`工具对git暂存区的文件，做哪些操作。
```json
{
   "name": "packageA",
   "lint-staged": {
      "src/**/*.{js,jsx,ts,tsx}": [
         "eslint --fix",
         "prettier --write",
         "git add -A"
      ],
   }
}
```
> 不要忘记 `npm install lint-staged`

#### husky
第三方工具所需字段

```json
{
   "husky": {
      "hooks": {
        "pre-commit": "lint-staged'
      }
   }
}
```

`husky`是一个可以监听git hooks工具，需要用npm安装后使用，它可以帮助开发人员在git某个阶段（例如本例子中的commit之前这个阶段）要发生前执行一些命令。

`新版（>=6.0.0）`不再默认实现所有的 git hook， 于是你不能直接在 package.json 中如下配置：

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

[详情参考](https://zhuanlan.zhihu.com/p/366786798)

舍弃 husky

因工作中的其它需求，被迫浏览 vite 源码，发现项目用 `simple-git-hooks` 取代 `husky`；

😕：husky 在 package.json 中给出配置之外，还要使用 husky 指令激活当前 git 仓库，理想情况下，我们需要一个工具，安装它之后，给出配置内容，everything will work，无需手动做任何事情。

😍：`simple-git-hooks`支持按需引入 `git-hooks`，一次配置即可工作；

### FAQ
#### pnpm无法使用用户自定义pre-script
pnpm 默认不支持 pre-script, 内置的 pre-script 是支持的；

比如 pnpm 支持 `preinstall` `postinstall`;
但不支持 `predev` `postdev`;

yarn 和 npm 默认都是支持的；

[pnpm参考]( https://pnpm.io/cli/run#differences-with-npm-run )
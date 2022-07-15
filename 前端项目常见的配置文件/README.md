### `babel.config.js`
babel的配置文件，babel用于不同版本js代码的转化、兼容、功能和语法上的polyfill  

**怎么用**
* npm安装babel
* 按照官网说明，编写好babel.config.js文件

**开发中要安装的babel库**
> 从**版本7**开始，babel相关的库**以@babel**命名，之前是**以babel**命名
* @babel/core
> 由@babel/parser、@babel/traverse、@babel/generate组成
* @babel/cli
> babel命令行工具，是一个可执行程序
* @babel/plugin-*
> babel周边插件，*是名字泛称标记
* @babel/preset-env
> babel常见环境的预配置
* babel-loader
> 告诉babel应该如何处理js文件，babel提供编译代码的能力，但babel不知道哪些.js文件需要编译，哪些不需要编译，像这些内容，就需要babel-loader告知babel.
* @babel/runtime
> 要结合 @babel/plugin-transform-runtime使用，将开发人员注入到编译过程中的代码打包成一个运行时库来管理，减少重复代码。

<br>

---

### `webpack.config.js`
webpack是前端工程最常见的打包器。
* 可编译前端项目并打包，部署到服务器上后，就可以访问；
* 可以提供热加载功能，供开发人员研发看效果；
  
**怎么用**
* npm安装webpack；
* 按照官网说明，编写好webpack.config.js 文件；
* 按照需要，npm 安装 webpack 插件/loader，并配置到 webpack.config.js 文件中；
* 也可以自定义 webpack插件/loader；

<br>

---

### `vue.config.js`
1. vue项目的配置文件，供vue-cli-service读取。  
2. 该配置文件最终会转为webpack的配置，也就是说该配置文件是vue对webpack做的一层封装，研发人员只要关注vue生态即可，不必再专门考虑webpack的问题。  
3. 因此，有了vue.config.js存在了，webpack.config.js就不用存在了。

**如何使用**
* npm安装vue脚手架；
* 脚手架初始化项目后，自然会看到该配置文件；
* 根据官网介绍，结合需求，配置自己的文件，安装必要的插件；
  
<br>

---

### `.env` `.env.production` `.env.development`
1. 设置环境变量的文件，里面用`XXX=YY`的格式设置环境变量。  
2. 该文件本身不会发生作用，只是做个记录而已，想要转化为真正的环境变量，还需要额外的程序读取他们，写入环境变量中。  
> 在vue项目中，vue-cli-service dev 会自动读取 `.env` `.env.development`，将其中的设置写入到环境变量中，因此在`vue.config.js`中，可以使用 `process.env`获取这些环境变量。  
> 在 go 项目中，也有相关的中间件读取。

<br>

---

### `vite.config.js`
vite 是一个开发工具，等效于 webpack，其 devServer是根据es6原理自己实现的，其打包器使用的是 rollup。 该文件就是其配置文件。

**如何使用**
* npm安装vite；
* vite初始化项目后，配置文件自热出现；
* 根据官网手册，配置使用；
  
<br>

---

### `.eslintrc`
eslint 的配置文件；  
eslint 用语检测js的语法问题，但并不提供修改、格式调整；  
eslint 主要用于使用编辑器敲代码的时候给出错误提示，而不是在编译项目的时候给出提示，这需要你：
1. npm安装了eslint；
2. vscode上安装了eslint插件；
3. 配置好.eslintrc文件；
> vscode插件只不过是利用你已经安装好的eslint完成检测，它本身不具备检测功能。

<br>

---

### `.prettierrc`
prettier的配置文件；  
prettier用于对代码进行格式调整，目的是让开发团队中的代码风格统一，方便代码管理、代码阅读；  
prettier支持的语言范围很多，不局限于js，还支持ts、java、html、css等等；

**如何使用** 
* npm安装 prettier；
* 根据官网介绍，编写好配置文件；

<br>

---

### `tsconfig.js`
tsc的配置文件；  
tsc是typescript的编译器，负责将ts代码转化为js代码；

**如何使用** 
* npm安装 typescript；
* 根据官网介绍，编写配置文件；
  > 项目中没有这个配置文件，你在vscode上写代码的时候，是没有ts智能提示的！
* 如果想用ts调用node标准库，还需要npm安装 @types/node；

<br>

---

### package.json中`husky`和`lint-staged`
```
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged'
    }
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

`husky`是一个可以监听git hooks工具，需要用npm安装后使用，它可以帮助开发人员在git某个阶段（例如本例子中的commit之前这个阶段）要发生前执行一些命令。

`lint-staged`是一个对已经加入到git暂存区文件进行处理的工具，也需要用npm安装。在本例子中，表示对暂存区中的.js结尾的文件，使用`eslint`和 `prettier`进行处理。

`husky` 和  `lint-staged` 也可以有自己单独的配置文件，就像 eslint那样，
但是他们也可以在package.json中进行配置，就像本例子所示那样。

---

### package.json中“browserslist”
用于指定项目所支持的浏览器版本，一些插件会读取这个信息，完成 css 前缀补全、js polyfill功能。比如 babel插件，postcss-normalize插件, autoprefixer插件。
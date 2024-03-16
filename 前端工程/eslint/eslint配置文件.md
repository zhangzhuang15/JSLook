## what is eslint
**一个 js 或者 ts 的语法检测器**。  

## what about eslint config file
`.eslintrc` or `.eslintrc.js` or `.eslintrc.json`

配合vscode中的 eslint 插件，在你编写 js 或者 ts 代码时，检测书写的语法错误，给出自动修改格式化；

配合 eslint的 typescript 插件，才可以检测到 ts 的语法问题；

eslint 的 `CLI` 一般配置在`package.json`的 `scripts`中，用于对指定的文件做一次整体检测，而不是像vscode eslint插件在书写代码的时候检测。

在 `lint-staged` 常会用到 eslint `CLI`，对暂存区的文件做整体检测。
> 文件越多，eslint整体检测一遍的时间越长；但实际上，暂存区的文件并不多，所以可以这么做。

<br>

## how to lint ts with eslint
安装依赖：
- eslint
- prettier
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint-plugin-prettier
- eslint-config-prettier

eslint 配置文件：
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```
明显能看出来的配置关系，就不再赘述了。

`plugin:prettier/recommended` 来自 `eslint-plugin-prettier`  

`plugin:@typescript-eslint/recommended` 来自`@typescript-eslint/eslint-plugin`  

`eslint:recommended` 来自 eslint 内置  

plugins 的 `@typescript-eslint` 就是指 `@typescript-eslint/eslint-plugin`  

plugins 的 `prettier` 就是指 `eslint-plugin-prettier`

### importance of `@typescript-eslint/parser`
eslint本身不支持解析ts，它使用 espree 解析js, 为了做到这一点，要使用`@typescript-eslint/parser`;

`@typescript-eslint/eslint-plugin`只是提供了一堆ts规则，它必须依赖`@typescript-eslint/parser`，才能将这些规则应用
到ts代码身上，因此，仅仅安装`@typescript-eslint/eslint-plugin`是不够的；

`@typescript-eslint/parser`基于`@typescript-eslint/typescript-estree`, 这个包的功能就是利用typescript编译器得到typescript AST，然后再转化为兼容 ESTree 的AST，prettier在处理ts的时候，也依赖这个包；


### 没有 `eslint-config-prettier`的事儿？
在 `plugin:prettier/recommended`存在[黑魔法](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration).
它会往 extends 字段中加入 `prettier`.
这个配置来自于`eslint-config-prettier`, 因此实际上还是用到了。[参考](https://www.npmjs.com/package/eslint-plugin-prettier) 

💥 如果没有 `eslint-config-prettier`，无法在 vscode 自动保存文件时，格式化文件（比如修正代码缩进问题）

### 补充
"extends" field:
* eslint的核心配置格式为 `"eslint:<name>"`;  
* 自定义的配置，如果发包到npm，包应该命名 `eslint-config-<configName>`，使用时要先下载该包，之后给 extends 赋值 `eslint-config-<configName>` 或 `<configName>`;
* eslint插件既可以定义规则，也可以定义配置，在使用插件中定义的配置时，应该先下载插件`eslint-plugin-<pluginName>` 或者 `@<scope>/eslint-plugin-<pluginName>` 或者 `@<scope>/eslint-plugin`, 给 extends 赋值 `plugin: <pluginName>/<configName>` 或 `plugin: @<scope>/<configName>`;

“plugins” field:
* 如果下载的插件包名为 `eslint-plugin-<pluginName>`, 可以赋值插件全名或者 `<pluginName>`;
* 如果下载的插件包名为 `@<scope>/eslint-plugin-<pluginName>` 或者 `@<scope>/eslint-plugin`, 可以直接赋值 `@<scope>`


## prettier & eslint  in vscode 
在 vscode 中：
- 使用prettier，请安装 `Prettier-Code Formatter` 插件；
- 使用eslint，请安装 `Eslint`插件；

一般的eslint插件，已经配置语法规则和format规则，比如 `@typescript-eslint/eslint-plugin`，就可以直接使用
eslint作为代码的formatter了，不需要再使用prettier；

如果想同时使用eslint和prettier，必须确保二者分工明确，eslint只去关心语法规则，不能有一丁点儿的format规则，然后 
将 prettier 作为 formatter。当我们编写代码，发生语法错误的时候，就会给出红色下划线警告；在我们保存代码的时候，prettier 
就会将代码格式整理好。二者不冲突。像vue源码中，对于eslint的规则，就是自己去配置的，没有使用eslint插件，就是防止插件中
存在format规则，在 prettier 格式化代码之后，格式不符合 eslint 的 format 规则，显示红色下划线。

另一种方式，就是上文提到的配置，解决eslint的规则冲突，搭配 `Prettier ESLint` 插件，用这个插件作为 formatter。
虽然能解决，但是配置相当麻烦，心智负担太大了，不建议再使用了。

你可能想针对不同的文件，使用不同的formatter，在vscode的settings.json中可以如此配置:
```json 
{
  // 所有ts文件如此处理
  "[typescript]": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
 
 // 告诉 eslint 插件，只能处理 js ts 文件，其余类型文件直接忽略
  "eslint.validate": ["javascript", "typescript"]
}

```



## FAQ
### 1、vscode保存文件时，没有对文件进行格式化？
在vscode `settings` 中输入`editor.save`，保证`formatOnSave`✅;

在`settings`中输入`editor.defaultFormat`, 保证`Default Formatter` 是 `ESLint` 或者 `Prettier ESLint`

找不到这两个选项，请安装vscode的 `ESLint` 插件， `Prettier ESlint` 插件， `Prettier` 插件


### 2、怎么检测css、less、scss的错误，格式化代码风格？**
在上个问题中，我们加入了 `plugin: prettier/recommended`, 引入了 prettier 推荐的配置，这个配置中就包含着  css less scss 的格式化设置，因此上个问题配置好后，就可以直接保存，格式化这些文件了。推荐的配置中，还支持` markdown `文件。

stylus是个例外。需要单独安装 vscode 的 `stylus` 插件。不过本人受不了 stylus 的古怪语法，不会使用该工具，就不介绍如何配置了，
欢迎补充：👇
```

```

### 3、为什么使用了eslint，还要使用prettier呢？
eslint本身除了代码语法检测之外，也支持格式化。  
prettier专注于代码的格式化。  
     
eslint 主要检测 js 代码语法是否有错误，如果有错误，可以进行纠正，也就是格式化。但是eslint没有办法检测到 ts、css、less 等其他语言的语法错误。 

### 4、plugins 和 extends 的区别？
eslint自身提供很多rule，并且按照这些rule对代码检查。可是如果要是想检查 vue 的代码怎么办，检查 react 的代码怎么办？要知道这些代码的rule，eslint并没有实现。

解决的方法就是 plugin。plugin定义了新的rule，去检查eslint照顾不到的代码。要注意哦，plugin只是定义了rule，告诉eslint，如果要检查代码，该怎么去检查。但实际上，eslint要不要去执行这些rule的检测工作，plugin做不了主。

谁做主呢？

rules做主。在rules中，可以设置到底该激活哪个rule。不过，实际的问题比较复杂，你不可能一个rule一个rule去配置的，有没有偷懒的方法呢？

有，就是使用 extends。extends就是继承别的配置文件中的rules，直接白嫖，就省的我们自己去配了。当然了，最开始的那一版本肯定是一条条配置的，否则就陷入“鸡生蛋，蛋生鸡”的问题了。

### 5、如何从eslint规则里禁掉和prettier冲突的哪些规则
安装 `eslint-config-prettier`, 在 eslint 配置文件中:
```js 
module.exports = {
  extends: ["prettier"]
}

```
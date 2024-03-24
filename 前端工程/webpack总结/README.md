[toc]

## webpack核心成员 Sean Larkin 的 webpack 分享
[链接](https://www.bilibili.com/video/BV1VS4y1G7W4/?spm_id_from=333.337.search-card.all.click&vd_source=8e22a21e39978743c185c338fa9b6d6d)

## webpack打包基本原理演示
[链接](https://www.bilibili.com/video/BV1CJ411T7k5/?spm_id_from=333.337.search-card.all.click&vd_source=8e22a21e39978743c185c338fa9b6d6d)

---

## 配置
- `webpack.config.js`
- `webpack.config.ts`
- `webpack.config.json`

配置内容不需要死记硬背，按照官网指引慢慢配置即可；

这里给出一个简单的例子。

```javascript {.line-numbers}
// webpack.config.js
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/** @type {import("webpack").Configuration } */
const config = {
    // 设置项目的入口文件
    entry: "src/main.js",
    // 指定多个入口文件时，应写为
    // entry: {
    //    main: "src/main.js",
    //    dev: "src/dev.js"
    // }

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    // 指定多个入口文件时，应写为
    // output: {
    //    filename: "[name].bundle.js"
    //    // 当修改源文件后，重新构建后的bundle.js文件名不变，
    //    // 会影响到 浏览器的缓存更新，所以采用下面的方法，
    //    // 一经源文件修改，bundle.js文件名就会更新
    //    // filename: '[name].[chunkhash].js'
    //    path: path.resolve(__dirname, "dist")
    //    /* 设置 import 方法动态引用的module将被存储到的文件名 */
    //    chunkFilename: '[name].bundle.js',
    // }
    //
    // 编译后在 dist文件夹下，你就能看到 main.bundle.js, dev.bundle.js

    // https://www.webpackjs.com/configuration/devtool/
    // 有了它，代码一旦出了问题，就可以定义到源码的位置，而不是 .bundle.js
    devtool: 'inline-source-map',

    // 配置 webpack-dev-server,
    devServer: {
        // 告诉 webpack-dev-server，客户端发送请求时，
        // 从哪个路径下查取文件，返回给客户端。
        // 也就是说 ./dist 将作为服务器的根目录/.
        // 比如客户端请求 http://localhost:8080/data/dog.png，
        // webpack-dev-server就会把 ./dist/data/dog.png返回给客户端
        contentBase: './dist',

        // 启用 HMR
        hot: true
    },

    // 配合 package.json中的 sideEffects 使用，
    // 在编译过程中，如果发现没有用到的内容，那么这些内容
    // 最终就不会出现在编译结果里。
    mode: 'production',

    plugins: [
        // 每次编译前，先清除 dist文件夹下的旧文件
        new CleanWebpackPlugin(['dist']),
        // 每次编译，生成一个 .html 文件，引用 .bundle.js,
        // 如果没有这个插件，需要手动写一个.html文件放入dist中，
        // 然后手动使用 script 的 src 引入 .bundle.js
        new HtmlWebpackPlugin({
            title: "output"
        }),
        // 当同一个依赖在两个.js中被引用时，其实就多了一份冗余的依赖，
        // 使用这个插件，可以将公共的代码提取出来，解决重复引用的问题
        new webpack.optimize.CommonsChunkPlugin({
            // 指定公共代码名称，公共代码将被写入 common.bundle.js文件中
            name: "common"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // 将 webpack 的引导代码单独写入到 manifest.xxxx.js文件中
            name: 'manifest'
        }),
        // 第三方库代码一般不会变动，但是每次构建因为它们的module.id 不同，
        // 导致输出的 bundle文件名变化，使用此插件就可以让固定代码module的
        // bundle文件不发生变化。
        new webpack.HashedModuleIdsPlugin()
    ],

    module: {
        rules: [
            {   
                // 被处理的文件
                test: /\.css$/,
                // 处理文件时使用的插件，
                // 光配置还不成哦，还要使用npm install 安装他们。
                // 之后，就可以使用 import 引入 css 文件了。
                use: ['style-loader', 'css-loader']
            },
            {
                // 可以使用 import 引入.png .svg .jpg .gif文件了，
                // 例如 import png from './dog.png', png就是图片
                // 的 url，可以赋值给 <img> 的 src 属性。
                test: /\.(png|svg|jpg|gif)$/,
                use: [ 'file-loader']
            },
            {
                // 在css文件中可以使用 url 引入字体文件啦
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [ 'file-loader']
            },
            {
                // 可以用 import 引入 csv文件啦，
                // 这将转换为 js 对象 来供你使用
                test: /\.(csv|tsv)$/,
                use: [ 'csv-loader']
            },
            {  
                // 可以使用 import 引入 xml文件啦，
                // 这将转换为 js 对象供你使用
                test: /\.(xml)$/,
                use: [ 'xml-loader']
            }
        ]
    }
};

module.exports = config;
```


## 使用方式
- webpack command 
- webpack API

## 安装 
```shell
pnpm install -D webpack webpack-cli
```

```json {.line-numbers}
// package.json
{
    // 标记所有的文件，一旦文件中的内容在构建项目中没有用到，
    // 可以在编译结果中将这些内容删除。
    "sideEffects": false,
    // 如果你想指定一些文件，不考虑删除冗余、没使用到的内容，
    // 可以指定
    // “sideEffects”: [ 'file1.js', 'file2.css' ]
    ...
    "scripts": {
        // 编译代码
        "build": "webpack",

        // 运行代码，在浏览器中查看效果,
        // 记得要 npm install webpack-dev-server -D
        "start": "webpack-dev-server --open",

        // webpack会监看文件是否发生变化，如果发生变化，重新编译代码，
        // 但是不会导致网页的自动刷新
        "watch": "webpack --watch"
    }
    ...
}
```

## FAQ
### `output.path` 和 `output.publicPath`
设置`output.path`，打包好的文件就会存储在这个路径下边。

**注意，这个路径必须是绝对路径。** 

所以你会看到这个配置项的位置，一般会出现 `__dirname`;

*情景举例*：  
你位于 `/Project/`，该文件夹下拥有`webpack.config.js`文件，在该文件中设置`output.path = path.resolve(__dirname, "dist")`.
打包之后，你就可以在`/Project/dist/`下看到打包后的文件了。

`output.publicPath`解决的是静态资源的路径问题。

我们在 `.css` 文件中会使用`url()`指定图片来源，比如设置一个`div`的背景图。

如果图片是存放在远程的服务器上，我们直接在`url()`中写出图片完整的http路径即可。

但也有另一种情况：我们的图片来源于本地，可能css文件位于`/Project/css/`，被引用的图片位于`/Project/images/`，此时我们就会在`url()`中使用相对路径的做法，`../images/picture1.jpg`。

问题来了，打包之后，`../images/picture1.jpg`的`..`是相对于谁呢？

webpack处`url()`中的路径时，会对这个路径进行修改。

它会用`output.publicPath + 打包后filename` 的方式修改。

比如：
* `output.publicPath="./"`,   
* 你在`url()`中写的路径`../images/picture1.jpg`，  
* 你在处理图片的loader中指定 `filename: static/[hash][ext]`,   
* 并且假设 picture1.jpg 的 hash为 `mmm`,   

则：
* webpack 会将 `../images/picture1.jpg` 直接替换为 `static/mmm.jpg`

* webpack修改后的路径为`./static/mmm.jpg`.
  > `./` + `static/mmm.jpg`

问题又来了，`output.publicPath="./"`中的`.`是相对于谁的呢？

当`output.publicPath`指定的是相对路径，它相对的是浏览器当前URL。

举个例子：
* 假设 css文件中定义了 `.box`这个类，该类中使用了`url("./images/pin.png")`, 
* 同时 `output.publicPath="./"`, 
* 你在处理图片的loader中指定 `filename: static/[hash][ext]`,   
* 并且假设 pin.png 的 hash为 `mmm`,   
* `.box`在`index.html`中使用，
* `index.html`在浏览器的URL为`http://localhost:8081/dist/index.html`,

则
1. webpack处理之后的 `url()` 中的路径为 `./static/mmm.png`，
2. 该路径对应的URL为`http://localhost:8081/dist/static/mmm.png`。
3. `output.publicPath="./"`指的就是 `http://localhost:8081/dist/`

`output.publicPath` 该写成相对路径还是绝对路径，到底该怎么写呢？

问题根源在于，你打包好的静态文件，你想放在哪里。

你是想放在和入口html文件同目录下呢，还是放在别的服务器上。

假设打包之后的dist文件夹结构如下：
```
dist ------- index.html (入口 html 文件)
       |
       |
       ----- static --- mmm.png
       |
       |
       ----  js  ---- main.js
```
如果你把 dist 部署到一个服务器上，并且使用 nginx 等手段设置好路由，
一旦访问 `http://localhost:8001/index.html`，浏览器上显示的就是 index.html的内容。

那么此时，output.publicPath 就应该取相对路径"./"，因为这样设置的话，
webpack处理之后的 `url()` 刚好是 `url("./static/mmm.png")`, 包含
`url()`的css又在 `index.html`里边，路径刚好就是`http://localhost:8001/static/mmm.png`, 刚好由nginx就可以拿到 mmm.png。

如果你在此基础上做一下调整，将js文件夹，static文件夹放在别的服务器上，
并且希望：
- 访问`http://ddd.com/static/mmm.png` 就能访问 mmm.png 文件
- 访问 `http://ddd.com/js/main.js`就能访问 main.js 文件

那么你的 `output.publicPath` 应该设置为 `http://ddd.com/`.


总结下`output.path`和`output.publicPath`:
- 二者没有直接联系；
- 你一开始在css文件中写的url相对路径，都会被webpack替换为 `output.publicPath + filename`;
- output.publicPath 具体写成什么，要看你打包后的静态资源和入口html文件存放在哪里；
- 入口html文件中，非html-webpack-plugin插件生成的路径，也就是你自己写死的`src` `href`, webpack不会去调整，如果不对劲，你需要自己调整 

### library libraryTarget libraryExport 有什么作用？
当你开发完了一个js包，然后使用webpack打包处理后，会生成一个bundle文件，别人在引用这个bundle文件会出现很多情况。

假设你开发的js包就只有一个入口文件:
```js 
// entry.js 

export function hello() {
    console.log("hello")
}

export function world() {
    console.log("world");
}

```

#### 如果是在html的`<script>`标签里引入，如何访问js包的功能？

这样定义：
```js 
module.exports = {
    output: {
        library: "Util",
        libraryTarget: "var"
    }
}
```
这样使用：
```html 
<body>
    <script src="./bundle.js"></script>
    <script>
        Util.hello()
    </script>
</body>
```
<br>
<br>
<br>

这样定义：
```js 
module.exports = {
    output: {
        library: "Util",
        libraryTarget: "window"
    }
}
```
这样使用：
```html 
<body>
    <script src="./bundle.js"></script>
    <script>
        window.Util.hello()
    </script>
</body>
```

<br>
<br>
<br>

这样定义：
```js 
module.exports = {
    output: {
        library: "Util",
        libraryTarget: "this"
    }
}
```
这样使用：
```html 
<body>
    <script src="./bundle.js"></script>
    <script>
        // 这里 this === window
        // 在没有定义 this 的执行环境中，你可以自定义this变量！
        // 比如 var this = {}
        this.Util.hello()
    </script>
</body>
```


<br>
<br>
<br>


这样定义：
```js 
module.exports = {
    output: {
        library: "Util",
        libraryTarget: "amd"
    }
}
```
这样使用：
```html 
<body>
    <script src="./bundle.js"></script>
    <script>
        window.Util.hello()
    </script>
</body>
```

<br>
<br>
<br>

这样定义：
```js 
module.exports = {
    output: {
        library: "Util",
        libraryTarget: "var",
        libraryExport: ["world"]
    }
}
```
这样使用:
```html
<body>
    <script src="./bundle.js"></script>
    <script>
        // 无法访问 hello 方法！
        // Util.hello()

        Util.world()
    </script>
</body>
```

<br>
<br>
<br>

这样定义：
```js 
module.exports = {
    output: {
        libraryTarget: "module"
    },
    experiments: {
        outputModule: true,
    }
}
```
这样使用:
```html 
<body>
    <script type="module">
        import * as Util from "<your-bundlejs-url>"

        Util.hello()
    </script>
</body>
```

#### 如果是在 node 里引入，怎么访问？
这样定义：
```js 
module.exports = {
    output: {
        library: "Util",
        libraryTarget: "commonjs"
    }
}
```
这样使用：
```js 
require("./bundles").Util.hello();
```

<br>
<br>
<br>

这样定义:
```js 
module.exports = {
    output: {
        library: "Util",
        libraryTarget: "commonjs2"
    }
}
```
这样使用:
```js 
// library: "Util" 的定义其实没用
require("./bundle.js").hello();
```


### webpack怎么使用tree-shaking ?
生产模式下，webpack默认就会tree-shaking;

研发模式下：
1. package.json 加入 `"sideEffects": false`
2. webpack.config.js
   ```js 
   module.exports = {
    mode: "production",
    optimization: {
        usedExports: true,
        sideEffects: true,
    }
   }
   ```

tree-shaking不成功的话，最有可能是依赖的库出了问题：
- 它的package.json不包含`sideEffects: false`
- 它采用了commonjs的模块

### webpack怎么使用 code split ?
默认使用webpack的时候，所有的js会打包到一个文件中；

使用 code split, 会把一部分js代码打包到 chunk 文件中；

举个例子：

```tsx 
import { createRoot } from "react-dom/client"
import { App } from "./App";

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);

createRoot(container).render(
    <App />
);
```
默认情况下，打包生成的文件中，会包含`react-dom/client`中的代码，导致打包好的文件比较大，影响性能。而实际上，像这些依赖，可以抽取到单独的文件，将原本很大的bundle文件，打散成体积更小的多个chunk文件，然后让浏览器一个个加载，而不是一口气加载一个大文件。这种优化，就是 code split。

[官方教程](https://webpack.js.org/guides/code-splitting/)

这里给出一个简易版本：
```js 
module.exports = {
    output: {
        filename: "[name].chunk.js"
    },
    optimization: {
         splitChunks: {
           chunks: "all"
        }
    }
}
```

代码中使用`import()`加载的js，会被webpack提取到单独的chunk文件；

### webpack 如何关闭性能报告？
启动webpack，打开浏览器后，默认会分析网页性能，如果不符合webpack推荐的性能指标，会在界面上显示一个问题报告，有时候这个很讨厌，我们想关闭它，只需:
```js 
module.exports = {
    performance: {
        hints: false
    }
}
```

### webpack怎么压缩js代码？
```js 
const terserPlugin = require("terser-webpack-plugin");

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [new terserPlugin()],

    }
}
```

你也可以使用其它插件，比如`uglifyjs-webpack-plugin`

### webpack hmr 可以解决 react 组件刷新问题么？
不可以。hmr是基于module而言，每次更新的时候，会把目标module重新使用 __webpack_require 加载一遍,只要 react 组件一经修改，组件所在的module就会更新，导致整个页面更新，然后组件就会从新初始化，组件之前的状态没有保留下来。这不是我们所期待的组件刷新。

我们希望，组件文件经过修改后，该组件以及引用该组件的上级组件更新，而不是页面级别更新。

因此，必须要有相关插件的支持，有一个 `react-refresh` 的包就是为了解决这个问题。

`next`本身加入的 `Fast Refresh` 特性也是针对这个问题的。

`vite-plugin-react`借鉴`react-refresh-webpack-plugin`完成该问题的支持。

[Dan神给出的该问题解决思路](https://github.com/facebook/react/issues/16604)


### 如何支持 ts 的 paths
使用`resolve.alias`

tsconfig.json:
```json 
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

webpack.js:
```js 
const path = require("path");

module.exports = {
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src");
        }
    }
};
```

### 如何无需引入，直接在scss中使用定义好的变量
使用 `sass-resources-loader`;
预定义的变量假设放在 a.scss 中，将 a.scss 的路径加入到上述loader的 resources 选项中，就可以实现
在其他 scss 文件中，直接使用这些变量，无需引入 a.scss;

### 为什么启动dev server后没有看到dist文件夹
默认情况下，打包好的文件会存储在内存，不会放在磁盘，因此你看不到dist文件夹，但这个行为
也可以通过配置 `devServer.writeToDisk: true ` 改变。

### bundle、chunk and module ?
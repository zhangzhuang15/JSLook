```shell
// 安装 webpack 
npm install webpack -D
npm install webpack-cli -D
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


```javascript {.line-numbers}
// webpack.config.js

const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
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
}

```


## output.path 和 output.publicPath
#### 当你使用webpack打包，打包之后生成的文件要存储在哪里呢？
output.path解决的就是这个问题。设置好output.path，打包好的文件就会存储在这个路径下边。**注意，这个路径必须是绝对路径。** 执行完打包操作后，你就能在这个路径下找到结果。

*情景举例*：  
你位于 `/Project/`，该文件夹下拥有`webpack.config.js`文件，在该文件中设置`output.path = path.resolve(__dirname, "dist")`.
打包之后，你就可以在`/Project/dist/`下看到打包后的文件了。


#### 在html文件中引用静态资源的路径问题？
我们在 `.css` 文件中会使用`url()`指定图片来源，比如设置一个`div`的背景图。
如果图片是存放在远程的服务器上，我们直接在`url()`中写出图片完整的http路径即可。

但也有另一种情况：我们的图片来源于本地，可能css文件位于`/Project/css/`，被引用的图片位于`/Project/images/`，此时我们就会在`url()`中使用相对路径的做法，`../images/picture1.jpg`。

---
问题来了，打包之后，`../images/picture1.jpg`的`..`是相对于谁呢？

webpack会在处理css文件的时候发现url中的路径，并且它会对这个路径进行修改。
它会用`output.publicPath + 打包后filename` 的方式修改。
比如 
* `output.publicPath="./"`,   
* 你在`url()`中写的路径`../images/picture1.jpg`，  
* 你在处理图片的loader中指定 `filename: static/[hash][ext]`,   
* 并且假设 picture1.jpg 的 hash为 `mmm`,   

则
* webpack 会将 `../images/picture1.jpg` 直接替换为 `static/mmm.jpg`

* webpack修改后的路径`./static/mmm.jpg`.
  > `./` + `static/mmm.jpg`

---
问题又来了，`output.publicPath="./"`中的`.`是相对于谁而言的呢？

当`output.publicPath`指定的是相对路径，那么它相对的是浏览器当前URL。
举个例子：
* 假设 css文件中定义了 `.box`这个类，该类中使用了`url("./images/pin.png")`, 
* 同时 `output.publicPath="./"`, 
* 你在处理图片的loader中指定 `filename: static/[hash][ext]`,   
* 并且假设 pin.png 的 hash为 `mmm`,   
* `.box`在`index.html`中使用，
* `index.html`在浏览器的URL为`http://localhost:8081/dist/index.html`,

则
1. webpack处理之后的 url 中的路径为 `./static/mmm.png`，
2. 该路径对应的URL为`http://localhost:8081/dist/static/mmm.png`。
3. `output.publicPath="./"`指的就是 `http://localhost:8081/dist/`


---
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
假设你把 dist 部署到一个服务器上，并且使用 nginx 等手段设置好路由，
一旦访问 `http://localhost:8001/index.html`，浏览器上显示的就是 index.html的内容。
那么此时，output.publicPath 就应该取相对路径"./"，因为这样设置的话，
webpack处理之后的 `url()` 刚好是 `url("./static/mmm.png")`, 又在 `index.html`中出现，
刚好就可以拿到 mmm.png 图片。

假设你在此基础上做一下调整，将 js 文件夹，static文件夹放在别的服务器上，并且访问
`http://ddd.com/static/mmm.png` 就能访问 mmm.png 文件，访问 `http://ddd.com/js/main.js`就能访问 main.js 文件， 那么你的 `output.publicPath` 应该设置为 `http://ddd.com/`.


> output.publicPath 和 output.path没有直接联系；
> 你一开始在css文件中写的url相对路径，都会被webpack替换为 `output.publicPath + filename`;
> output.publicPath 具体写成什么，要看你打包后的静态资源和入口html文件存放在哪里；
> 入口html文件中，非html-webpack-plugin插件生成的路径，也就是你自己写死的`src` `href`, webpack不会去调整，如果不对劲，你需要自己调整。 
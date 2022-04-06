```shell
// 安装 webpack 
npm install webpack -D
npm install webpack-cli -D
```

```json
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


```javascript
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
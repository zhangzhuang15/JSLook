const path = require("path")
const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "./",
    filename: "js/main.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: [ "style-loader", "css-loader"]
      },
      {
        test: /\.(scss|sass)$/,
        use: [ "style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|jpe?g|webp)$/,
        type: "asset",
        generator: {
          filename: "images/[hash:5][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
        }]
      }
    ]
  },
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, "./src")
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html")
    })
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, "src/asset"),
      publicPath: "/asset"
    },
    host: "localhost",
    port: 8088,
    open: true,
    hot: true,
  },
  mode: "development"
}


/**
 * How to write webpack config file in .ts format ?
 * 
 * you should make sure something done:
 * install dev-dependencies:
 *     `typescript`
 *     `ts-node`
 *     `@types/node`
 *     `@types/webpack`
 *     `@types/webpack-dev-server` (if you use webpack-dev-server)
 *
 * ts-node@10.7.0 supports esm by option `--esm`, but if you still
 * meet some trouble, you should take this solution:
 *  install dev-dependency `tsconfig-paths`
 *  write a new config file, e.g. `tsconfig-for-webpack-config.json`:
 *  ```
 *   {
 *      "compilerOptions": {
 *          "module": "commonjs",
 *          "target": "es5",
 *          "esModuleInterop": true
 *      }
 *   }
 *  ```
 *  launch webpack like this:
 *  ```
 *  {
 *    "scripts": {
 *       "build": "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack"
 *     }
 *  }
 *  ```
 *
 * these information come from webpack@4 official website
 * https://v4.webpack.js.org/configuration/configuration-languages/
 */

/**
 * if you develop a library with webpack, you should config
 * `output.library` `output.libraryTarget`.
 * 
 * after you execute `webpack` and build `dist/index.js` file,
 * if you don't make configs just mentioned, you cannot export
 * any API from `dist/index.js`, i.g. you will be failed to 
 * import `dist/index.js` from html <script> tag.
 * 
 * you can config output.libraryTarget = 'umd', then you can
 * access the API after adding <script> tag referring `dist/index.js`,
 * these APIs will be mounted on window object.
 * 
 * alternatively, you can config output.library = "MyModule",
 * then you can access the API by MyModule variable which is
 * mounted on window object. 
 */
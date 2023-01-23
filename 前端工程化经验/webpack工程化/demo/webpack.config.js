const path = require("path")
const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

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
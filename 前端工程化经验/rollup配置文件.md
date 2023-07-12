库或者框架 的打包工具。

原生支持 es6 标准下的js代码打包，不支持其他资源的代码，如 .css .png .jpeg .mp3;

如果要打包ts，需要引入 rollup 的 typescript 插件`rollup-plugin-typescript` 或者 `rollup-plugin-typescript2`；

如果支持 es5 的 api pollyfill， 需要加入 rollup的 babel 插件`rollup-plugin-babel`;


### FAQ
#### 1、rollup 配置文件不能是 ts 文件？
默认情况下， rollup 无法识别 rollup.config.ts 文件，只能识别 rollup.config.js 文件。

解决方法：
* 下载 `rollup-plugin-typescript2`;
* 在package scripts打包命令中包含 `rollup --configPlugin typescript2`，告诉 rollup， 使用 `typescript2` 插件去识别 ts 版本的配置文件。
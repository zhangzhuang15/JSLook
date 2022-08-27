利用Rust编写 nodejs 的扩展

## 使用的工具
* neon
  > 安装： `npm install -g neon-cli`
* rust
  > 安装方式见rust官网

---

## 开搞
* `cd ~/ && mkdir rust-extension && cd rust-extension`
* `neon new extension`
    > 会生成一个extension文件夹，里面还有其他的文件夹；
    > lib中放置的是供测试.node扩展文件的js代码
    > native中放置的是rust项目，最终生成的.node文件就会被放置在这个文件夹下
    > native/src中放置的是编写.node扩展的rust源码
* `cd extension && npm install`
  > 安装相关的npm包，rust模块，编译rust代码，你会看到生成一个index.node文件
* `node lib/index.js`
  > 查看index.node被调用后是否正常执行
* 在 native/src中编写你自己的rust代码，增加新功能到node扩展吧🤩，之后`npm install` 编译新的.node扩展，再用`node lib/index.js`检验你自己写的扩展内容。🥳
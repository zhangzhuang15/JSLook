module.exports = {
    "extension": ["ts"],
    "spec": ["dist/test/**/*.spec.js"],
    "enableSourceMaps": true,
    //"require": ["babel-register.js"]
}

/**
 * 上述配置也可以写入 .mocharc.json 中，但是json不支持注释，
 * 在vscoode中会出现红色下划线，影响开发体验，因此选择配置文件
 * 选择 js 版本
 * 
 * 配置参考: https://github.com/mochajs/mocha-examples/blob/master/packages/typescript-babel/.mocharc.json
*/

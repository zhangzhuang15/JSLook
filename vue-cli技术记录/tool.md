### joi
js 数据结构格式的校验器
[joi官网](https://joi.dev/api/?v=17.6.0)
```javascript
const joi = require('joi');

const scheme = 
        joi
        .object()
        .keys({
            latestVersion: joi.string().regex(/^\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/),
            lastChecked: joi.date().timestamp(),
            packageManager: joi.string().valid('yarn', 'npm', 'pnpm'),
            useTaobaoRegistry: joi.boolean(),
            presets: joi.object().pattern(/^/, presetSchema)
        });

const { error, value } = scheme.validate({packageManager: 'nvm'});

if (error !== undefined) {
    // 校验失败的字段
    console.log("wrong label: ", error.details[0].context.label);

    // 校验失败的字段值
    console.log("wrong value: ", error.details[0].context.value);

    // 校验失败时，对错误的描述信息
    console.log("error message: ", error.details[0].message);
}
```

### semver
版本号字符串处理器
[官网](https://github.com/npm/node-semver#readme)

```javascript
const semver = require('semver');

semver.gt('1.2.3', '9.8.7'); // false
semver.lt('1.2.3', '9.8.7'); // true 
```
``` shell
^1.2.3 和 ~1.2.3 有什么区别？
解释下版本号的含义： [major].[minor].[patch]

^不允许 major minor patch 中最左侧的非零数字发生改变。
^1.2.3 代表的版本号含义就是 1.2.3 ≤ version < 2.0.0
^0.4.2 代表的版本号含义是 0.4.2 ≤ version < 0.5.0

～在 minor明确设置的情况下，只允许 patch 发生改变。
~1.2.3 代表的含义是 1.2.3 ≤ version < 1.3.0
~1.2   代表的含义是 1.2.0 <= version < 1.3.0
~1     代表的含义是 1.0.0 ≤ version < 2.0.0
~0.1.0 代表的含义是 0.1.0 <= version < 0.2.0
~0     代表的含义是 0.0.0 <= version < 1.0.0

``` 

### minimist
命令行参数解析器

```javascript
const minimist = require('minimist');

// 如果执行 node script.js -age 14 --name=jack peter 15
const args = minimist(process.argv.slice(2));

// args:
// {
//   '_': ['peter', 15],
//   'age': 14,
//   'name': 'jack'
// }

// _ 中存放是 position arg 

// -age 14， age 就是 option arg 
// --name=jack, name 也是 option arg 
// peter 15 就是 position arg 
```

### pkg-dir 
获取nodejs or npm项目根目录绝对路径
```javascript
const pkgDir = require(process.cwd());
```

### lru-cache
提供lru算法的容器

```javascript
const LRU = require('lru-cache');

const cache = new LRU({ max: 10, maxAge: 3000 });
cache.set('a', {  name: 'jack' });

// block 3s later ....
cache.get('a'); // undefined
```
```shell
LRU算法？
LRU： 最近最少被使用。
最近最少应该这样理解： 某个元素距离上一次被访问时的时间间隔达到最大，它就是最近最少被使用的元素。
```

### portfinder
获取一个可用的端口号
```javascript
const portFinder = require('portfinder');

let Port;
const portFinder.getPort((err, port) => {
    if (!err) {
        Port = port;
    }
});
```

### clipboardy
从剪切板读取数据；写入数据到剪切板；
 Mac Win Linux 都支持，跨平台😍
```javascript
const clipboard = require('clipboardy');

clipboard.writeSync('Jazzz');

const content = clipboard.readSync();
```

### dotenv
读取`.env`文件中的变量到 `process.env`

```javascript
const dotenv = require('dotenv');

// 读取工作目录下的 .env 文件，把环境变量
// 写入 process.env 中，并且将 .env 文件中
// 的变量解析成一个对象返回
const env = dotenv.config();
```
[更多配置](https://www.npmjs.com/package/dotenv)

### dotenv-expand
dotenv的变量扩展
```shell 
# .env 

Name=jack
Author=$Name
```

```javascript

const dotenv = require('dotenv');
const env = dotenv.config();

// process.env.Author = '$Name'
// Oh Not!😱

const dotenvExpand = require('dotenv-expand');
const Env = dotenvExpand(env);

// process.env.Author = 'jack'
// Env.Author = 'jack'
//
// (^_^)
```

### debug
打印调试信息的工具;
比 console.log 打印出来的更可读；

```javascript
const Debug = require('debug');

const debugHttp = Debug('http');
const debugWs = Debug('Ws');

debugHttp('server is running');

debugWs('ws server is listening at port 8876');
```

### @achrinza/node-ipc
一个 IPC 工具；
应该是基于 node 原生API的封装，抽离成一个包，简化 IPC的使用；
[详情](https://www.npmjs.com/package/node-ipc)


### launch-editor
使用这个库可以完成这样的操作： 用一个编辑器打开一个文件，并且令光标定位到具体的行列位置。

```javascript
const launch = require('launch-editor')

launch(
  // filename:line:column
  // both line and column are optional
  'foo.js:2:2',
  // try specific editor bin first (optional)
  'pycharm',
  // callback if failed to launch (optional)
  (fileName, errorMsg) => {
    // log error if any
    console.log(fileName, errorMsg);
  }
)

// 如果成功，将用 pycharm 打开 foo.js，光标
// 定位到第2行第2列，如果失败了，执行回调函数
```
[官网](https://github.com/yyx990803/launch-editor#readme)


### open 
使用平台的默认工具打开一个文件。
比如用默认浏览器打开网页，用默认图片编辑器打开图片，用默认音频文件打开一个mp3文件。

底层如何实现的👀
操作系统一般会提供这样的可执行程序给我们，直接封装即可。比如在MacOS上，提供的就是`open`命令。
`open https://www.baidu.com/` 就会用Safari浏览器打开网页。

```javascript
const open = require('open');

await open('https://www.baidu.com/');
```
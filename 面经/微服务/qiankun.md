[toc]

## Get started
```sh 
$ yarn add qiankun
```
your master application:

```ts 
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react app', // app name registered
    entry: '//localhost:7100',
    container: '#yourContainer',
    activeRule: '/yourActiveRule',
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    container: '#yourContainer2',
    activeRule: '/yourActiveRule2',
  },
]);

start();
```
in your sub-application entry js file:
```ts 
// 必须定义的生命周期函数
// 只会调用一次。当你的子应用初始化的时候，调用一次。
// 下次你的子应用再出现到主应用界面上时，就不会再调用了。
export async function bootstrap() {
  console.log('react app bootstraped');
}

// 必须定义的生命周期函数
// 每次子应用出现在主应用界面上时，都要调用本方法
export async function mount(props) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'));
}

// 必须定义的生命周期函数
// 每次子应用从主应用界面上拿下时，都要调用本方法
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
}

// 可选的生命周期函数
export async function update(props) {
  console.log('update props', props);
}
```

your sub-application webpack config:
```js 
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${packageName}`,
  },
};

// 在上述配置下，打包后的子应用，一经加载运行，就会将
// 子应用的一些信息注册到 window 对象上，主应用就能收到
```

## 怎么实现的样式隔离？
一些知识准备：
qiankun 使用 `import-html-entry` package 解析 html 内容，将其中的`<script>`抽出来，
剩下的内容就被称为 template；
也就是说，app的html不是直接放进浏览器环境，加载、运行的，而是被当作字符串，经 `import-html-entry`
处理后，人为控制地执行script，一步步加载、运行；


严格模式下，就是将app的template挂载到 shadow dom 下;
```js 
// 如何创建 shadow dom ?

const h = document.getElementsByClassName("h1");

// 创建了一个shadow dom
const shadowDom = h.attachShadow({ mode: "open"});

const p = document.createElement("p");
p.innerHtml = "hello";

// 向shadow dom 插入一个 <p>hello</p>
shadowDom.appendChild(p);


// 更多信息参考：https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
```

scoped模式下，给app的wrapper html element设置 data-qiankun属性，
属性值由app的name决定，然后遍历app中的style节点，使用正则表达式修改里面的css rule， 加上 data-qiankun属性选择器的限制
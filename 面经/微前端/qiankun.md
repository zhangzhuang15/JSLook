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

## 怎么加载子项目
子项目会单独部署在一个服务器上，加载子项目的时候，会用fetch发送http请求，获取子项目的html。

子项目有个唯一标识值name（就是一个字符串），主项目是知道的，使用name生成一个appId(也是一个字符串，格式为`<name>_<数字>`或者直接等于`<name>`)。

将html中的`<head>`替换为`<qiankun-head>`，完成后，将html包裹在一个div标签中，这个div标签长相：
```html 
<!-- 为了说明，假设 name="vueDemo"-->

<div 
  id="__qiankun_microapp_wrapper_for_vue_demo__" 
  data-name="vueDemo" 
  data-version="3.1.2" 
  data-sandbox-cfg="{}">
</div>

<!-- data-sandbox-cfg的值是 sandbox配置对象的JSON序列化字符串-->

<!-- 子项目的 html 就放在这个div 内 -->
```

接下来，会再创建一个div，包裹上述的div标签(qiankun称之为appElement or appWrapperElement)，并且会处理里面的css样式，为了方便解释，将上述div标签称作 H。
> 创建一个div，包裹上H的目的是将
> 字符串转化为DOM节点，因为H一开始只是字符串，当 div.innerHtml = H 处理之后，div.firstChild就得到了DOM节点版本的H。
> 最终加入网页的是H节点，不是新创建的div节点

如果启动严格css隔离模式，会给 H 创建一个 shadowDom, 然后将 H.innerHtml 移动到 shadowDom 下；

如果采用scoped css隔离样式，会给 H 添加属性 `data-qiankun`, 属性值为 appId。然后遍历H中的style节点，将每个节点内的css样式加上`div[data-qiankun="<appId>"]`的约束；

> 特殊说明：
> 对于外联样式，qiankun使用 import-entry-html解析子产品html的时候，会将外联样式转化为内联样式，也就是时说如果遇到`<link rel="stylesheet" href="./a.css" />`, 会把它替换成`<style>里面是a.css的内容</style>`
>
> 这个逻辑是在 import-entry-html 源码实现的

在qiankun的配置中，会指定子项目挂载到哪个DOM节点下，最后只需要将H插进该DOM节点即可。

在上述过程中，js资源并没有做任何处理，子项目中的js代码都没有执行呢。

qiankun创造了一个js的sandbox，让js资源在这个sandbox内执行，这就完成了js上的隔离。不同app，虽然js代码中有同名的变量，也不至于发生冲突。值得注意的是，document变量是各个app共享的，等于 window.document，没有做mock处理。这就意味着不同app的DOM挂载点尽量不要相同，除非是故意设计在一个DOM下挂载多个app；

详见qiankun源码`loader.ts`：
- `loadApp` 
- `getDefaultTplWrapper`
- `createElement`

关键package: `import-html-entry`

## render 和 mount 
qiankun基于single-spa,当app挂载时，single-spa就会调用app的mount方法。

像react、vue这样的框架，会创建一个js对象，之后将js对象和DOM节点捆绑，这就叫做mount。

为了区分两个概念，qiankun将框架的mount称之为 render，这个render需要项目自己定义，qiankun不会直接调用它。一般情况，项目定义好render函数，并在mount函数中调用，而mount函数会暴露给qiankun，于是qiankun就可以通过调用mount，来唤醒 render。


## 样式隔离的一些补充
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


## js隔离 
为了具体解释，先看一个问题，顺着这个问题去搞清楚。

子产品线会有一个打包好的js文件，该文件里面会给出一些生命函数的定义，比如
-  `mount` 
-  `bootstrap`
-  `unmount`
-  `update`

基座是如何通过qiankun访问到它们的呢？

先看看打包是如何做的吧。使用打包工具，上述声明函数会被设置给window对象，使用 window.mount 就可以访问到 mount，打包出来的代码，类似于：
```js 
window.mount = function mount() {
  // 子产品线定义的mount函数
}

window.unmount = function unmount() {}

window.update = function update() {};

window.bootstrap = function bootstrap() {};
```
这个js文件，被称作子产品线的 entry 文件； 

再来看看基座加载子产品线代码的情况，qiankun会使用`import-entry-html` entry 文件中的代码提取出来，
本质就是内容是代码的字符串。

要知道，一个html文件中有很多`<script>` 标签，到底哪一个标签对应的是 entry 文件呢？

`import-entry-html`给出了规定：
- 如果 `<script entry >` 带有 `entry`属性，则该标签对应的就是 entry 文件；
- 如果没有找到，认为最后一个 `<script>` 标签对应entry文件；

> 见`import-entry-html`源码的 `process-tpl.js`

如何拿到数据呢？

使用eval函数。

`eval("3 + 4")` 会返回 7；

`eval("(function(){ console.log('a')})")` 会返回一个匿名函数，一旦执行，打印`‘a’`;

顺着这个思路，如果有：
```js 
const t = {};
eval(`(function(window){
  window.mount = function mount() {
    // 子产品线定义的mount函数
  }

  window.unmount = function unmount() {}

  window.update = function update() {};

  window.bootstrap = function bootstrap() {};
})(t)`);
```
会怎么样呢？

没错，`mount`这些生命周期函数都会被写入到 `t`;

eval有了，eval里的函数内容也有了，就差如何搞出来 `t` 这样的东西了；

上面的 `t` 有什么问题呢？

如果函数体访问了`window.addEventListener()`，代码就挂了，因此 `t` 必须满足两点：
- 它不是 window 对象；
- 经过它必须能访问到 window 对象的方法；

也就是说，`t` 应该是 window 对象的代理, proxy.

这仅仅是一个子产品线的 entry 文件的情况，如果推广到多个子产品线，单单依靠一个 `t` 是不行的，因此要为每个子产品线创建一个 `t`，各自的 `mount` 生命周期函数挂载到各自的`t`.

这就是js隔离的原理，为每个子产品线创建自己的 proxy. 只在自己的proxy中，运行自己的js代码；

ok，那么该如何实现proxy呢？

qiankun给出了三种模型实现：
- LegacySandbox(基于 window.Proxy)
- ProxySandbox(基于 window.Proxy)
- SnapshotSandbox 


### SnapshotSandbox原理 
源码文件: `snapshotSandbox.ts`
当启动sandbox时，将当前window对象的自有属性(不是原型链上的属性，而且是可遍历的属性), 记录在sandbox的一个对象上，
然后从sandbox另一个对象上，将sandbox上次失效时缓存的window属性值重新赋值给window（类似于进程上下文恢复）.

### LegacySandbox 和 ProxySandbox原理 
源码文件: `legacy/sandbox.ts` `proxySandbox.ts`
创建一个fakewindow，也就是一个 普通的 `{}`，然后利用
Proxy API 创建 fakewindow 的代理，如果访问的属性就位于 fakewindow身上，就选择fakewindow身上的属性，否则就会在 window对象上寻找，涵盖了Proxy的这些handler:
- set 
  > 有个sandboxrunning限制，只有当前sandbox激活时才能使用。
  > 因为在设置一个属性的值时，可能是在 fakewindow 身上设置，也有可能在 window 本身上设置。
  > 对于后者，会存在一个白名单的情形，目的是解决在研发和测试环境的一些依赖问题，比如webpack热重载需要设置windowde `'__REACT_ERROR_OVERLAY_GLOBAL_HOOK__`属性，为了不影响webpack使用，需要放行。

- get 
- has 
- getOwnPropertyDescriptor
- ownKeys
- defineProperty
- deleteProperty
- getPrototypeOf

实现起来的难度来自于各个handler触发时，都要考虑哪些情景下的问题, 属于业务逻辑问题。

ProxySandbox 将window上不可配置的属性拷贝到了 fakewindow，LegacySandbox则不然，而且在代码写法上，ProxySandbox做了进一步整理（类似代码重构）, 如果用户在使用qiankun的时候，没有指定一个sanbox的配置项，默认启用 ProxySandbox, 如果配置为 `{ sandbox: { loose: true } }`就会启用LegacySandbox;

当浏览器不支持 Proxy API时，会降级到 SnapshotSandbox


## 基座和子产品线如何通讯

答案在qiankun源码`loader.ts`的 `loadApp`函数：
```ts
export async function loadApp<T extends ObjectType>(...) {

  // ...

  const parcelConfig: ParcelConfigObject = {
      name: appInstanceId,
      bootstrap,
      mount: [
        async () => {
          if (process.env.NODE_ENV === 'development') {
            const marks = performanceGetEntriesByName(markName, 'mark');
            if (marks && !marks.length) {
              performanceMark(markName);
            }
          }
        },
        async () => {
          if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
            return prevAppUnmountedDeferred.promise;
          }

          return undefined;
        },
        async () => {
          appWrapperElement = initialAppWrapperElement;
          appWrapperGetter = getAppWrapperGetter(
            appInstanceId,
            !!legacyRender,
            strictStyleIsolation,
            scopedCSS,
            () => appWrapperElement,
          );
        },
        async () => {
          const useNewContainer = remountContainer !== initialContainer;
          if (useNewContainer || !appWrapperElement) {
            appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
            syncAppWrapperElement2Sandbox(appWrapperElement);
          }

          render({ element: appWrapperElement, loading: true, container: remountContainer }, 'mounting');
        },
        mountSandbox,
       
        async () => execHooksChain(toArray(beforeMount), app, global),

        // 就是这里哦！在挂载子产品线的时候，
        // 基座将负责通讯的hook setGlobalState
        // onGlobalStateChange 注入给子产品线了
        async (props) => mount({ ...props, container: appWrapperGetter(), setGlobalState, onGlobalStateChange }),
       
        async () => render({ element: appWrapperElement, loading: false, container: remountContainer }, 'mounted'),
        async () => execHooksChain(toArray(afterMount), app, global),
       
        async () => {
          if (await validateSingularMode(singular, app)) {
            prevAppUnmountedDeferred = new Deferred<void>();
          }
        },
        async () => {
          if (process.env.NODE_ENV === 'development') {
            const measureName = `[qiankun] App ${appInstanceId} Loading Consuming`;
            performanceMeasure(measureName, markName);
          }
        },
      ],

  // ...


}
```

基座和子产品线的js代码，都运行在自己的js sandbox 中，但是像 `setGlobalState` 所更改的 `globalState`却是所有产品线共享的，其实现位于qiankun源码的`globalState.ts`中，就相当于全局变量的事件总线。


## bootstrap mount unmount load unload
这些都是 single-spa 的生命hook；

bootstrap 只会调用一次， 发生在 mount 之前；

当路由第一次和app匹配，就会执行 load，仅仅执行一次；

每次路由和app匹配，mount都会执行，对于使用singla-spa的人员来说，需要在mount函数中实现：
- 将 app 的 html 内容append 到 container dom element下
  > qiankun里就是使用 render 函数
- 激活 app 的 js 代码
  > qiankun里就是调用产品线暴露的mount函数实现，像 ReactDOM.render(), vue的 createApp().mount() 就发生在此;
  > 在调用mount之前，qiankun必须active js sandbox；

每次路由和app不匹配， unmount都会执行，对于使用singla-spa的人员来说，需要在unmount函数中实现：
- 将 app 的 html 内容从 container dom element下remove
  > qiankun里就是使用 render 函数
- 激活 app 的 js 代码
  > qiankun里就是调用产品线暴露的unmount函数实现，像 ReactDOM.unmountComponentAtNode(), vue的instance.unmount() 就发生在此;
  > 在调用unmount之后，qiankun要inactive js sandbox；

unload仅仅是一个可选项，single-spa建议不使用它；
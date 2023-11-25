[toc]

### 响应式基本原理
[vue2原理介绍文章](https://vue-js.com/learn-vue/reactive/object.html#_3-依赖收集)
[vue3原理介绍视频](https://www.bilibili.com/video/BV1SZ4y1x7a9?p=2&vd_source=8e22a21e39978743c185c338fa9b6d6d)

### 为什么在vue3中，解构会破坏响应式？
解构会创建新的对象。
```ts 
let obj = { name: "jack" };
const { name } = obj;

// name的解构，是创建一个新的对象，把里面的
// name 属性值赋值给 name 变量
```

```ts 
const obj = ref(0);

// 必须通过obj的 dot 运算符才能触发响应式
obj.value = 10;

// 即便value是一个引用类型变量，但是离开了
// obj，不通过 dot 运算符访问value，没办法
// 触发响应式
const {value} = obj;
```

### 如何理解vue的单向数据流？
父组件通过props传递数据给子组件，子组件只能读取数据。如果一旦子组件修改了数据，那么
父组件原数据就会被修改，会影响其他子组件的数据发生变化。

<br>

### vue组件之间的通讯方式有哪些？
* 父子组件用props通讯；
* 子组件通过`$emit`事件对父组件传值；
* 父组件使用`$children`获取子组件数据，子组件使用`$parent`获取父组件数据;
* 二次封装使用 `$attrs` 和 `$listener`进行传值；
* 使用`$refs`获取组件实例，进而获取数据；
* 使用Vuex进行状态管理，获取数据；
* 使用 eventBus 进行跨组件传值；
* 用 provide 和 inject ；
* 使用浏览器本地缓存，如 localStorage;
* 路由传值；

> eventBus实质上就是一个全局 Vue 实例，一个组件向该实例发送事件，
> 另一个组件注册事件，通过事件收发的机制，完成跨组件信息通讯；


<br>


### 写个自定义的v-model
```javascript
   <input v-model="inputValue" />
       等效于
   <input :value="inputValue" @input="inputValue = $event.target.value" />

```

<br>


### \$attrs 和 \$listener 有什么了解
用于二次封装，将先辈组件的属性和事件传给后辈组件
```javascript
// 在父组件中
   <childComponent v-bind="$attrs" v-bind="$listener" />
```

<br>


### Vue组件的生命周期有哪些
vue2:
* beforeCreate: Vue实例化，但是还没有进行数据初始化和响应式处理；
* created： 数据已经被初始化和响应式处理，可以访问和修改数据；
* beforeMount: render函数调用，生成虚拟DOM，但是还没有挂载到真实的DOM上；
* mounted： 真实DOM挂载完毕；
* beforeUpdate: 数据更新后，新的虚拟DOM生成，但是还没有对旧的虚拟DOM打补丁；
* updated: 旧DOM打完补丁，真实DOM更新完毕；
* activated: 被 keep-alive缓存的组件被激活时调用；
* deactivated: 被 keep-alive缓存的组件停用时调用；
* beforeDestroy: 实例销毁前调用，实例数据依旧可以访问；
* destroyed：实例销毁后调用；
* errorCaptured: 捕获子孙组件的错误被调用。接收三个参数，error, errorComponent, errMessage。返回false的时候，可以阻止错误继续上传。

vue3:
- setup
- onBeforeMount
- onMounted
- onBeforeUpdate
- onUpdated 
- onBeforeUnmount
- onUnmounted
- onActivated
- onDeactivated
- onErrorCaptured

<br>


### 什么时候会触发组件销毁，销毁的时候会卸载自定义事件和原生事件吗？
页面关闭，未使用keep-alive的路由切换，v-if都可以触发组件销毁；
组件销毁时会自动卸载组件本身绑定的事件，定时器、全局对象的事件、eventBus 不会自动解绑，要手动解绑。

<br>


### 自定义指令都有哪些钩子？
vue2.0为例：
* bind: 指令绑定到指定元素时触发，只触发一次；
* inserted： 指定元素插入到DOM时触发，只触发一次；
* update: 指令所在组件的VNode更新时触发，此时子组件的VNode可能没有触发呢，会触发多次；
* componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
* unbind: 指令解绑时触发，只触发一次；

<br>


### vue2.0数据响应有哪两个缺陷？
1. 对象新增属性或修改新增的属性时，无法触发视图更新，需要使用Vue.set，对象删除属性时需要使用 Vue.delete才能触发更新;
2. 数组直接通过下标修改元素无法触发试图更新，需要使用数组的方法 splice、push等

<br>


### vue如何实现对数组的监听，为什么不对数组下标修改做劫持？
vue2通过重写数组原型上的方法来达到对数组的修改监听。因为数组中的元素数量很大，
对每个元素都进行劫持，非常耗性能。


<br>


### 常见的v-model的修饰符有哪些，有什么作用？
* `v-model.lazy` 让内容在 `change` 事件时更新，而不是发生 `input` 事件时更新； 
 
* `v-model.number` 将内容转换为number类型，如果内容不是数字字符串，不会发生错误，不做任何转换操作； 
  
* `v-model.trim` 可以过滤掉内容首尾的空白符；
  

<br>


### 自定义v-model 
[官方介绍](https://cn.vuejs.org/guide/components/v-model.html#handling-v-model-modifiers)

vue3中，默认使用v-model, 绑定的是组件`modelValue` 属性，model修饰符存储在组件`modelModifiers`属性，触发的更新事件是`update:modelValue`.

如果指定 `v-model:title.catch`, 绑定的是组件`title`属性，model修饰符`catch`存储在组件`titleModifiers`属性，触发的更新事件是`update:title`.


<br>


### 父组件和子组件的事件通讯是如何实现的？
```
// 父组件
 <Child @click="onClick()" />

 methods: {
    onClick() {}
 }
```
```
// 子组件
 在某个方法中调用 this.$emit('click')；
 就可以出发子组件的click事件，从而引发onClick方法被调用；
```

- 父组件注册事件
- 子组件触发事件

<br>

### activated 和 deactivated 什么时候触发？ 
* 组件必须使用 `<keep-alive>`封装
* 当进入组件时，触发 activated; 当离开组件时，触发 deactivated
> 不要将 activated 和 deactivated，与 vue组件的生命周期混为一谈，
> 他们是组件缓存使用时才存在的。

<br>

### `v-if` 和 `v-show`的区别
* `v-if`是插入和删除DOM实现的存在和消失，消失状态下，就是对DOM片段没有渲染；
* `v-show`是设置 `display: none`实现的；

<br>

### `watch`方法有什么要注意的地方？
* `watch`方法允许调用异步函数；
* `watch`方法在观察一个对象的属性变化时，最好带上`deep: true`;
* `watch`方法可以设置`immediate: true`，对 被观察的属性立即执行 callback 回调；

*使用格式*
```javascript {.line-numbers}
function callback(newValue, oldValue) { ... }

vm.$watch('age', 
         callback, 
         {
            immediate: true,
            deep: true
         }
)
```

<br>

### vue-router有哪两个模式？各自的原理是什么？
* `hash模式` 和 `history模式` 

*hash模式*
```javascript
// 监听 location.hash 的改变；
// hash的改变，不会重新发送url请求给后端；
 window.onhashchange = function(e) {
    const oldURL = e.oldURL
    const newURL = e.newURL

    // 对 newURL 进行一些处理
 }
 ```

 *histroy模式*
 ```javascript

 // url改为了 /jack, 但是没有向后端发送请求
 history.pushState({}, '', '/jack')

// 历史回退时调用
 window.onpopstate = function(e) {
    // 在这里做一些页面组件替换的处理
 }
 ```
 详情见[history.html](./history.html)
 
 最新的版本中，只有`popstate`事件被保留下来，没有使用`hashchange`

 <br>

### style scoped属性的原理是什么？
举个例子
```html
<style scoped>
    .dog {
       color: red;
    }
</style>
<template>
  <div>
    <p class="dog">dog</p>
  </div>
</template>
<script></script>
```
* 经过编译后，组件内的所有dom元素都会被添加一个`data-v-hash`格式的属性;
* 对`<style scoped>`内的样式，追加属性选择器标签 ;  
 
编译结果如下：
```html
<style>
 .dog[data-v-908776ae8] {
    color: red;
 }
 </style>
 <template>
   <div data-v-908776ae8 data-v-98765aae4>
     <p class="dog" data-v-908776ae8>dog</p>
   </div>
</template>
<script></script>
```
* `908776ae8`是组件自身的hash值；
* `98765aae4`是父组件的hash值；
  
*样式击穿方法* 
> ```html
> <style scoped>
>   .a >>> .b {}
> </style>
> ```
> 上述会编译为
> ```html
> <style scoped>
>   .a[data-v-45q35gfdzg] .b {}
> </style>
> ```
> `>>>` 也可换成 `/deep/` `::v-deep`


<br>

### 如何定义一个Vue的插件？
```txt
Vue插件就是一个 
{ 
   install(Vue, options) {

   } 
}
对象，install方法的第一个参数就是Vue这类
```
在install方法中，使用Vue提供的方法定义全局filter，全局组件，
或者在 Vue的原型上绑定自定义的方法，供其他组件掉用。

```js
// 使用自定义的组件只需要
Vue.use(plugin, options)
```

<br>

### Vuex的使用思路
vuex由几个部分组成：
1. state   -> 类比vue组件的data属性；
   > state可以是返回一个对象的函数，也可以直接是一个对象；    
   > 箭头函数和普通函数都可以。
2. getters -> 类型vue组件的computed属性；
   > getters中的每个方法的参数都是 state；
3. mutations -> 类型vue组件的methods属性；
   > mutations中的每个方法，第一个参数都是 state，第二个参数是要传入的其他数据；  
   > mutations的方法都是同步的；
4. actions;
   > actions的每个方法，第一个参数是一个对象context，该对象拥有 dispatch和commit方法可以使用，dispatch用来触发action，commit用来触发mutation。通常情况下用对象分解的写法使用{ commit, dispatch };
   > 第二个参数用来接收用户自定义传来的负载数据。
5. modules;
   >  modules用来分模块管理不同用处的state，比如用户信息方面的state，产品信息的state，这些state写在一起的话，导致单文件非常臃肿，不便于业务逻辑管理，因此拆分出单独的module结构，在modules中集合在一起。
   ```js
   module结构
     {
        namespace: true,
        state: {},
        getters:{},
        mutations: {},
        actions: {}
     }
   ```
   ```js 

   创建 store 对象
   import { createStore } from 'vuex'

   const modules = {
      moduleA,
      moduleB,
      moduleC
   }
   const store = createStore({
      modules
   })
   ```
   ```js
   Vue中使用 store

   import { createApp } from 'vue'

   createApp().use(store)

   或者vue2的方式：
   new Vue({ store }).mount("#app")
   ```

### 为什么vue要将组件更新放置于微任务队列中？
浏览器的渲染逻辑是，执行一个宏任务，然后执行微任务队列里的所以微任务，接着重新渲染页面，然后执行下一个宏任务....

将组件更新放在微任务中，可以将若干个组件的更新操作，在浏览器一次渲染过程中完成，形成批量更新的效果。

如果放在宏任务中，组件的更新就会分散在多次浏览器渲染中，性能不太出色。




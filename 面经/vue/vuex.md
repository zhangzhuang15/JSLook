[toc]

## What 
Vuex 是 vue框架下的数据管理库，作用和 react-redux 一样。

vuex 的模型：
- store 
- namespace
- module
- state 
- mutation
- action 
- getter

vuex 创建的数据，其实就是一个js对象。

这个对象挂载于 vue app对象（利用`app.config.globalProperties` 和 `vue.reactive`），因此：
- 不同组件都能同步访问它
- 它在内存中的生命时长和vue app对象一样；
- 获得响应式 

## store
包含所有 mutation， action， getter， state，namespace信息，
其核心是存储了一个 module图（存储module的Map）

## namespace 
这其实是一个花里胡哨的东西，实际上就是给每个module冠以路由的概念，增加父子module的层次感。

## module 
这是一个非常重要的概念。

一个module对应一个state，对应多个mutation, 对应多个action,对应多个getter, 对应0或多个子module。

在初始化store的时候，遍历module图，图中所有的mutations, state, actions, getters注册到store对象中。

这就等于说根据module的namespace、子module name、mutation name、action name、getter name组成一个唯一的路径，用这些路径作为key，在store身上建立了全局平铺的module Map、mutation Map、action Map、getter Map。

state Map是个例外，它的结构不是平铺的，而是父到子到孙的层级结构。

## state
state就是维护的数据，和redux不同的时候，vuex的state颗粒度更细，只更新必要的，而redux会将state整体再生成一遍。

store拥有state属性，module也拥有state属性。因此这里的state，有全局和局部概念之分。

store._state是响应式的，store.state也是响应式的，是利用`vue.reactive` API 实现的。

## mutation 
用于直接同步更新state。

## action 
同步或者异步更新state，最终更新的那一步是调用commit mutation完成的。

一般action对应简短的业务逻辑，比如发送一个请求，请求成功返回后，调用 commit mutation更新state.

## getter
只读属性，类似于vue实例的computed属性。

因为vue的 reactive 特性，依赖更新，getter也就同步更新了，像redux就没有响应式，其中没有getter的概念。

## VS redux 
因为vue reactive特性，使得 vuex 要比 redux 数据更新和控制的颗粒度更小。

但另一方面，redux是函数式编程，都是纯函数，所有数据的更改都在开发者掌控之中，数据流走向更清楚，更安全。

使用不当的话，reactive可能会带来意料之外的数据变更，给开发者带来困惑。

## future
随着vue3.0稳定并发布，vuex已经无法胜任，应改用[`pinia`](https://pinia.vuejs.org/core-concepts/)
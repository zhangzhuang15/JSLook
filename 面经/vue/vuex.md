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
state就是维护的数据，和redux不同的是，vuex 的state颗粒度更细，只更新必要的，而redux会将state整体再生成一遍。

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
随着vue3.0稳定并发布，vuex已经无法胜任，应改用[pinia](https://pinia.vuejs.org/core-concepts/)

pinia在设计上，使用了hooks的思路，vuex的module概念被提升为store概念，使用hook的时候，是按需引入的，不会把所有的store都引入，在vuex中，你需要在main.js中，向Vue注册store，而store里的所有module，也是在注册的时候一并加入的，在pinia里，不是这样，只有在你引入store的时候，store才会注册。

在vuex中，要用 `commit` 调用 mutation，用`dispatch`调用action，你还必须指定mutation或者action的路径名，增加记忆负担。

在pinia中，取消 mutation, 只有 action，而且无需记忆路径名，你定义的action名是什么，就直接用这个名称的函数就可以了，比如action名是 hello， 调用 store.hello 即可。


## Caveat
### non-namespace module
如果没有给module设置`namespaced: true`，所有module：
- mutation 都会注册到 store._mutations 
- actions 都会注册到 store._actions 
- getters 都会注册到 store._wrappedGetters

_mutations, _actions, _wrappedGetters都是 Map 结构，它们的key怎么取的呢？

mutation的函数名，会作为 _mutations 的 key；

action的函数名，会作为 _actions 的 key；

getter的函数名，会作为 _wrappedGetters 的 key；

很有可能两个module拥有同名的mutation，比如都叫`HRL`，则它们都会被放入到 store._mutations["HRL"]中，没错，它是一个数组。

当你用 `commit("HRL")`时，结果两个都被触发了，这个就是 non-namespace 的问题。

action也是如此。

如果有两个名字一样的 getter，第二个 getter 就会被忽略，不予注册。

module的 state，名字是"Dog"的module，它的state会注册到 store._state.Dog 上边。

因此如果两个module名字相同，也会出现问题：
```js 
const module = {
    state: {},
    modules: {
        Cat: {
            state: {}
        },
        Dog: {
            state: {},
            modules: {
                // 又一个state，这里边的 state 会覆盖掉外层的Cat.state，令其数据丢失
                Cat: {
                    state: {}
                }
            }
        }
    }
}
```

解决上述问题，就可以用 namespaced；

所谓namespace，就是让每一个module带有一个路径名，就像文件路径一样，这样可以区分两个module，举个例子：
```js 
const rootModule = {
    state: {
        hello: ""
    },
    namespaced: true,
    modules: {
        dog: {
            namespaced: true,
            state: {
                hello: ""
            },
            modules: {
                husky: {
                    state: {},
                },
                tiddy: {
                    namespaced: true,
                    state: {}
                }
            }
        },
        cat: {
            state: {}
        }
    }
}

/**
 * rootModule 的namespace为 “”
 * 
 * dog module 的 namespace为 “dog/”
 * 
 * kusky module 的 namespace也是 "dog/"
 * 
 * tiddy module 的 namespace是 "dog/tiddy/"
 * 
 * cat module 的 namespace 是 ""
 */
```
namespaced也有问题，如果 rootModule 和 cat Module 都有一个 叫做 HTL 的 mutation，再次发生重复！

如果你要访问 rootModule 的 hello state，要用`store.state.hello`;

如果你要访问 dog Module 的 hello state, 要用`store.state.dog.hello`;

如果 rootModule 有一个 dog state，那么 dog module 就会把它覆盖掉！

无论你使用 namespace 还是 non-namespace，都会有很严重的心智负担，这便是 vuex 的致命伤！
[toc]

## What 
redux是一个数据管理库，和具体框架无关。

本质上讲，redux管理的数据，就是全局变量，贯穿整个app生命周期。

核心概念：
- state
- action
- reducer 
- store

大致关系如下：
```txt 
╭----------------╮
|     store      |
|  ╭---------╮   |       ┌-----------┐
|  | state 1 |<----------| reducer 1 | <-- action 1
|  ╰---------╯   |       └-----------┘
|                |
|  ╭---------╮   |       ┌-----------┐
|  | state 2 |<----------| reducer 2 | <-- action 2
|  ╰---------╯   |       └-----------┘
|                |
|  ╭---------╮   |       ┌-----------┐
|  | state 3 |<----------| reducer 3 | <-- action 3
|  ╰---------╯   |       └-----------┘
╰----------------╯
```

### state
表示被管理的数据，本质就是js的Object.
每一个 reducer 管理一个 state，这些state合并为一个大的js对象，作为 store 的 state。

### action
state的改变，不是随随便便就改变的。和业务逻辑一样，必须是在某种条件下，做出对应的变动。在A条件下，state的数据增大；在B条件下，state的数据变小。

action就是用来描述这种条件。按照习惯，action拥有一个type属性，一个payload属性。 type属性用于做出种类划分，比如标记是对数据做增运算，还是减运算。 payload属性则提供state变动的外在依赖数据。

### reducer
和 `Array.prototype.reduce` 方法一样，表示一种纯粹的运算，输入量是上一次的state值，输出量是更新后的state。

reducer包含了 state 和 action两个概念。

```ts 
const reducer = (state = {}, action) =>{
    switch(action.type) {
        case "ADD":
            return { 
                value: state.value + action.data 
            };
        case "KEEP": return { ...state };
        default:
            return { value: 10 };
    }
}
```

### store 
上述概念的集合，就是一个store。

本质上，它是一个js对象，它的属性提供了访问state， dispatch action, 订阅state变动的功能。


## dispatch action 
如果使用 `createStore` API创建一个 store 的时候，没有指定state的初始值，那么store所维护的state，可能是`{}` 或 `undefined`.

当 dispatch action的时候，action会被送入到所有的reducer中，每个reducer会返回一个state，这些state存储在一个Object中，就成为了 store 的 state了。

比如：
```ts
import { combineReducers } from "redux";
const reducer1 = (state = [], action) => {
    /** 省略 */
    return { value: 100 }
};

const reducer2 = (state = [], action) => {
    /** 省略 */
    return { value: 10 }
};
const store = createStore(
    combineReducers({ reducer1, reducer2 })
);

store.dispatch({ type: "ADD", payload: 10 })

/**
 * dispatch之后，store将会得到这样的state:
 *  {
 *    reducer1: { value: 100 },
 *    reducer2: { value: 10  },
 *  }
 */

/**
 * 注意每次dispatch的时候，所有的reducer都会执行的，
 * 每次都会重新生成一遍上述的state。
 */
```
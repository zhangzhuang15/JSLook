[toc]

## 参考
[React渲染行为解析](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/)

## 如何减少组件重新渲染
复用组件，让组件不会再次渲染，本质就是直接使用旧的fiber节点。
方法：
- 使用`shouldComponentUpdate`
  ```tsx 
  class Child extends Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.key === nextProps.key) {
            return true;
        }

        return false;
     }
  }
  
  const Parent = () => {
    return <div>
        <Child />
    </div>
  };
  ```
- `PureComponent`
  ```tsx
  class Child extends PureComponent {
    render() {
        return <div></div>;
    }
  }

  const Parent = () => {
    return <div>
        <Child />
    </div>
  };
  ```
- `memo`
  ```tsx
  const Child = () => {};

  const MChild = memo(Child);

  const Parent = () => {
    return <div>
        <MChild />
    </div>
  }
  ```
- `useMemo`
  ```tsx 
  const Child = (props) => {
    return useMemo(() => {
        return <div></div>
    }, [props])
  };

  const Parent = () => {
    return <div>
        <Child />
    </div>
  };
  ```


## 如何检测组件重新渲染
```tsx
function Child() {
    useEffect(() => {
        return () => console.log("child render")
    });
}
```
当组件重新渲染的时候，旧组件就会被destroy，打印 `child render`;
根据打印的次数，就可以判断重新渲染情况了。

## 函数组件重新渲染的大致过程
函数组件重新渲染的时候，会重新执行函数，得到新的vnode节点。

之后react为vnode节点生成新的fiber节点。

组件的dom节点挂在于旧fiber节点。

对比新、旧fiber节点上的信息，对比 fiber节点上存储的 vnode 节点信息，对旧fiber节点上的dom节点进行更新。

dom节点更新之后，页面内容就刷新了。
> 注意，这个过程中没有新建dom节点。

## 为什么组件列表中，组件需要一个key，而且key必须要唯一，还不能是 Math.random() 生成的唯一随机数？
这和vnode相关。vnode的存在，是为了复用已创建的dom节点。读取新vnode的信息，调用旧dom节点的DOM API将这些信息更新，使得旧dom节点更新为新dom节点。

想要复用dom节点，就不能引入删除dom、插入dom的操作。

判断的依据来自于dom节点对应的fiber节点信息。

如果比较两个fiber节点，发现它们一致，那么就会复用dom节点。

而组件的key就是判断它们是否一致的重要依据。

⭐️两个fiber节点一致的条件：
- type要一样
- key要一样
- 属于同一个层级

因此，组件需要一个key。

key保证唯一，是为了在判断一致的时候，保证一对儿新旧fiber节点
参与，而不是许多fiber节点参与。

不能使用Math.random() 生成的key虽然唯一，但是组件刷新的时候，该函数会再次执行，新fiber节点的key会和旧fiber节点的key不一样，导致 dom 节点无法被复用。

## setState是同步的还是异步的
React < 18:
- 可同步，放在 Promise.resolve().then() or setTimeout() or 原生事件函数回调 中；
- 可异步，放在 React合成事件函数回调中， e.g. onClick()

React >= 18, 只能异步，走批量处理。

## 新旧值相同时，setState 和 setReducer 都会刷新组件么？
setReducer 会， setState 不会。

```tsx 
const Child = () => {
    const [value, setValue] = setState(0);
    const reducer = setReducer((x) => x, 1);

    // 不会触发组件更新
    setValue(0);

    // 触发组件更新
    reducer();
}
```

## fiber节点，vnode节点，dom节点，hook的联系

dom节点是DOM中的合法节点，是一个DOM对象，由浏览器定义。

fiber节点、vnode节点、hook都是javascript对象，由React定义。

fiber节点引用了 vnode节点、dom节点、hook。

fiber.stateNode 引用 dom 节点；
fiber.memorizedState 引用 hook；

经Babel编译的jsx，都会变成一个vnode。

hook是一个对象，存储状态值和依赖。
```tsx 
const v = useMemo(() => 13, [m]);
```
hook就会存储每次组件刷新时的状态值v，还有依赖 m；


## useEffect的依赖数组形式
- 省略依赖数组：每次组件更新的时候，useEffect都要执行
- 依赖数组是空的：在组件初始化的时候，useEffect执行一次，之后组件更新，不会执行；
- 依赖数组非空：当依赖项更新的时候，useEffect就会执行；

## useEffect中的setup和cleanup函数顺序
组件初始化的时候，会执行一次setup
> dev模式下，会执行一次setup、cleanup, 然后再执行一次setup

组件每次更新的时候，先执行cleanup，再执行setup.
组件卸载的时候，执行一次cleanup.

## useLayoutEffect和useEffect的差别
- 都根据依赖项去做执行
- useLayoutEffect执行时机是在浏览器重绘之前


## 函数组件返回`<></>`包裹的html，`<></>`会被渲染成什么？
这个问题可以在 typescript 官网的 playground 实验解决。

`<></>`会被渲染成 DocumentFragment。

在最终渲染的html页面上，`<></>`不会被渲染成任何 html tag.

## react什么时候唤醒schedule的？具体怎么schedule的？
ref: https://juejin.cn/post/6922302846524194829?searchId=20230826193629028D456744588B6075AB#heading-4


## 如何理解React的渲染
每次更新的时候，React会从 component tree 顶部开始，向下遍历各个组件，重新获得组件的 VNode(virtual DOM node):
- 函数式组件会重新执行一次
- 类组件会重新执行一次 render 方法

然后计算新、旧VNode之间的changes；

以上的这些工作，叫做 **reconcile**, 发生阶段就是 **Render 阶段**；
> The render phase determines what changes need to be made to e.g. the DOM.

React 之后会将这些 changes 同步到 DOM 上，这个阶段就是 **Commit 阶段**；
> The commit phase is when React applies any changes

DOM 更新后，React就会调用组件的 componentDidMount componentDidUpdate 等lifecycle hook function, 然后执行组件的useLayoutEffect hooks。
> 这些也是发生在 commit 阶段

间隔一小段时间后，执行所有的useEffect hooks，这个阶段就是 **Passive Effect 阶段**。这个阶段发生时，浏览器已经完成了repaint操作。

在React 18 中，Render阶段可以被打断、恢复，由同步变成了异步操作。


## React重点数据类型
**Hook**
```ts 
type Hook = {
  memoizedState: any,
  baseState: any,
  baseQueue: Update<any, any> | null,
  queue: any,
  next: Hook | null,
}
```

**Effect**
```ts 
type Effect = {
  tag: HookFlags,
  create: () => (() => void) | void,
  destroy: (() => void) | void,
  deps: Array<mixed> | null,
  next: Effect,
}
```

**Update**
```ts 
type Update<S, A> = {
  lane: Lane,
  action: A,
  hasEagerState: boolean,
  eagerState: S | null,
  next: Update<S, A>,
}
```

**Fiber**
```ts 
// A Fiber is work on a Component that needs to be done or was done. There can
// be more than one per component.
export type Fiber = {
  // These first fields are conceptually members of an Instance. This used to
  // be split into a separate type and intersected with the other Fiber fields,
  // but until Flow fixes its intersection bugs, we've merged them into a
  // single type.

  // An Instance is shared between all versions of a component. We can easily
  // break this out into a separate object to avoid copying so much to the
  // alternate versions of the tree. We put this on a single object for now to
  // minimize the number of objects created during the initial render.

  // Tag identifying the type of fiber.
  tag: WorkTag,

  // Unique identifier of this child.
  key: null | string,

  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType: any,

  // The resolved function/class/ associated with this fiber.
  type: any,

  // The local state associated with this fiber.
  // 真实DOM节点
  stateNode: any,

  // Conceptual aliases
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.

  // Remaining fields belong to Fiber

  // The Fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents (two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  return: Fiber | null,

  // Singly Linked List Tree Structure.
  child: Fiber | null,
  sibling: Fiber | null,
  index: number,

  // The ref last used to attach this node.
  // I'll avoid adding an owner field for prod and model that as functions.
  ref:
    | null
    | (((handle: mixed) => void) & {_stringRef: ?string, ...})
    | RefObject,

  // Input is the data coming into process this fiber. Arguments. Props.
  pendingProps: any, // This type will be more specific once we overload the tag.
  memoizedProps: any, // The props used to create the output.

  // A queue of state updates and callbacks.
  updateQueue: mixed,

  // The state used to create the output
  // 比如 存储hooks值
  memoizedState: any,

  // Dependencies (contexts, events) for this fiber, if it has any
  dependencies: Dependencies | null,

  // Bitfield that describes properties about the fiber and its subtree. E.g.
  // the ConcurrentMode flag indicates whether the subtree should be async-by-
  // default. When a fiber is created, it inherits the mode of its
  // parent. Additional flags can be set at creation time, but after that the
  // value should remain unchanged throughout the fiber's lifetime, particularly
  // before its child fibers are created.
  mode: TypeOfMode,

  // Effect
  flags: Flags,
  subtreeFlags: Flags,
  deletions: Array<Fiber> | null,

  // Singly linked list fast path to the next fiber with side-effects.
  nextEffect: Fiber | null,

  // The first and last fiber with side-effect within this subtree. This allows
  // us to reuse a slice of the linked list when we reuse the work done within
  // this fiber.
  firstEffect: Fiber | null,
  lastEffect: Fiber | null,

  lanes: Lanes,
  childLanes: Lanes,

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  // 组件更新时，表示上一次的fiber节点
  // 组件初始化时，是 null
  alternate: Fiber | null,

  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number,

  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number,

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number,

  // Sum of base times for all descendants of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number,

  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
  // __DEV__ only

  _debugSource?: Source | null,
  _debugOwner?: Fiber | null,
  _debugIsCurrentlyTiming?: boolean,
  _debugNeedsRemount?: boolean,

  // Used to verify that the order of hooks does not change between renders.
  _debugHookTypes?: Array<HookType> | null,
};
```

## render batch
每次调用 useState 会触发 re-render，如果连续调用可能就会触发多次 re-render。

render batch 的目的就是在连续调用 useState 的时候，将这些state的操作合成一个 batch，放在一次 re-render 过程处理。

在React 17 以及更早版本中，只会在**合成事件**中进行 render batch，在 **setTimeout** **Promise.resolve().then()** **原生事件** 中不会做 render batch.

ref: https://github.com/reactwg/react-18/discussions/21



## immutable updates 
mutable updates:
```ts 
const child = () => {
  const [data, setData] = useState([1,2,3])

  const onClick = () => {
    data[0] = 10;
    setData(data);
  }
}
```

immutable updates:
```ts 
const child = () => {
  const [data, setData] = useState([1,2,3])

  const onClick = () => {
    const nextData = data.map((item, index) => {
      if (index === 0) return 10
      return item
    })

    setData(nextData)
  }
}

```

## 从hook被调用的时候，发生了什么
```tsx 
const component = () => {
  const [message, setMessage] = useState("hello")
  const change = () => {
    setMessage("hello world")
  };

  return (
    <div onClick={change}>
      <h1>{message}</h1>
    </div>
  )
}
```
当`setMessage`被调用的时候，React大致会做什么呢？
1. 会更新 setMessage 对应的 hook， 这个 hook 位于 fiber节点的 memorizedState 属性；
2. 将该 fiber 节点加入到调度中；
3. 该 fiber 节点被调度的时候，会触发函数组件的更新（函数再执行一次），然后根据 reconciliation 创建新的fiber节点，旧fiber节点会赋值给新 fiber 节点的 alternate 属性，由于并发模式的引入，这个过程可以被中断；
4. 当步骤3完成之后，就会来到 commit 阶段，这个阶段无法中断，在该阶段，会根据 fiber 节点上的type信息，判断要创建新的DOM节点，还是修改DOM节点，还是插入DOM节点，还是删除DOM节点，然后完成DOM节点的操作；
5. 执行 useLayoutEffect 创建的 hook；
6. 页面更新；
7. 执行 useEffect 创建的 hook；


## dva qiankun umi 都是什么，各自有什么联系 ？
umi是一个企业级前端框架，它提供了一系列工具和组件，帮助开发者更加高效地构建应用程序，它更接近是一套前端解决方案。它涵盖了以下的一些内容：
- 提供状态管理工具(hooks)
- 提供前端路由管理工具(函数API，组件)
- 提供国际化工具
- 插件接入能力

qiankun是一个基`single-spa`的微前端实现库，它可以与umi配合使用，帮助开发者构建微前端架构。也就是说，你可以用umi开发各个业务线，然后使用qiankun将它们联合在一起，变成微前端体系。实际上，qiankun已经作为插件的形式引入到umi中，不需要你单独下载qiankun，单独配置使用，就像umi内部使用webpack构建项目，你不需要单独再下载webpack，编写webpack.config.js一样。

dva也是一种前端解决方案，但不像umi涵盖的范围那么大，它只整合了`状态管理`、`前端路由`两个方面。作为前端数据流的一种方案，它的重点并不在于创造一个新的概念或者技术，而是根据业务开发中常见的情形，整合现有的技术点。只需要安装一个dva即可，就不需要单独下载 `redux`, `react-redux` 等库。dva底层整合了这些package:
- redux 
- react-redux 
- react-router-dom
- redux-saga
- connected-react-router
- react
  
概括而言，你使用dva可以：
- 像react-redux那样，完成状态管理
- 像react-router-dom那样，完成前端路由控制
- 像redux-sage的写法那样，编写状态管理代码
- 使用dva后，可以省略用React的API完成App挂载

## dva中，可以dispatch一个异步操作(effect)，是如何实现的？
众所周知，redux 只能 dispatch 一个 action 到 reducer 中，
reducer是同步的；

dva之所以可以做到这点，是因为它使用的`react-saga`库实现了这个功能；

### 实现原理
1. `react-saga`作为redux中间件使用，可以访问 redux store 的 dispatch 方法，[redux中间件文档](https://redux.js.org/api/applymiddleware)

2. 在 sagaMiddleware 执行 run 方法的时候，将 effect 和 action.type 记录下来，sagaMiddleware 中间件被执行的时候，
根据 action，分析其 action.type，触发对应的 effect
```ts
function sagaMiddleware({ getState, dispatch }) {
    boundRunSaga = runSaga.bind(null, {
      ...options,
      context,
      channel,
      dispatch, // 捕捉了 redux store 的 dispatch 方法，之后会封装它
      getState,
      sagaMonitor,
    })

    return (next) => (action) => {
      if (sagaMonitor && sagaMonitor.actionDispatched) {
        sagaMonitor.actionDispatched(action)
      }
      const result = next(action) // hit reducers

      // 就是在这里触发 effect 执行的；
      // channel有个take方法，可以将 action.type
      // 和 effect 存储起来，一旦 action.type 和 
      // effect 的名字匹配，就会执行 effect
      channel.put(action)

      // 但问题来了，channel什么时候存储了 action.type
      // 和 effect 呢？

      return result
    }
}

// 使用 redux-saga：
// import { createStore, applyMiddleware } from 'redux'
// import rootReducer from './reducers'
// import { put, takeEvery, delay } from 'redux-saga/effects'
// import createSagaMiddleware from 'redux-saga'
//
// function* incrementAsync() {
//  yield delay(1000)
//  yield put({ type: 'INCREMENT' })
// }
//
// function* rootSaga() {
//  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
// }
//
// const sagaMiddleware = createSagaMiddleware()
// const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))
//
// sagaMiddleware.run(rootSaga)

// 按照上面，run方法一旦执行，就会把 rootSaga 传入到
// boundRunSaga，boundRunSaga就会执行，也就是在这
// 个函数中，action.type 和 effect 被存储起来了
sagaMiddleware.run = (...args) => {
  if (process.env.NODE_ENV !== 'production' && !boundRunSaga) {
      throw new Error('Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware')
    }
  return boundRunSaga(...args)
}

```

```ts 
export function runSaga(
  { channel = stdChannel(), dispatch, getState, context = {}, sagaMonitor, effectMiddlewares, onError = logError },
  saga,
  ...args
) {
  // 省略无关代码

  // 我们的 rootSaga 函数被执行了，因为
  // 定义为 function*,返回一个迭代器
  const iterator = saga(...args)

  // 省略无关代码
  
  const env = {
    channel,
    // 当在saga函数中，使用像 put 这样的redux-saga
    // 内置函数，意味着触发一个 reducer 或者 另一个 effect；
    //
    // 如果触发 reducer，直接用 redux store 的 dispatch 
    // 如果触发 effect，需要特别处理一下，给 action 加入一个
    // 属性值作为标记；
    //
    // wrapSagaDispatch就是来兼顾两种情况的
    dispatch: wrapSagaDispatch(dispatch),
    getState,
    sagaMonitor,
    onError,
    finalizeRunEffect,
  }

  return immediately(() => {
    const task = proc(env, iterator, context, effectId, getMetaInfo(saga), /* isRoot */ true, undefined)

    if (sagaMonitor) {
      sagaMonitor.effectResolved(effectId, task)
    }

    return task
  })
}

```
```ts 
// redux-sage/packages/core/src/internal/proc.js

function proc(env, iterator, parentContext, parentEffectId, meta, isRoot, cont) {
   // ....

   // env.finalizeRunEffect 默认为 (v) => v ,
   // 默认情况下，finalizeRunEffect 就是 runEffect
   const finalRunEffect = env.finalizeRunEffect(runEffect)

   // ....

   next()

   return task 

   function next(arg, isErr) {
    try {
      let result 

      if (isErr) {
        // ....
      } else if (shouldCancel(arg)) {
        // ....
      } else if (shouldTerminate(arg)) { 
        // ....
      } else {
        result = iterator.next(arg)
      }

      if (!result.done) {
        digestEffect(result.value, parentEffectId, next)
      } else {
        // .....
      }

    } catch (error) {
      // ....
    }

   }

   function digestEffect(effect, parentEffectId, cb, label = '') {
    // .....

    // finalizeRunEffect 其实就是 runEffect 函数
    finalRunEffect(effect, effectId, currCb)
   }

   function runEffect(effect, effectId, currCb) {
      if (is.promise(effect)) {
        resolvePromise(effect, currCb)
      } else if (is.iterator(effect)) {
        // resolve iterator
        proc(env, effect, task.context, effectId, meta, /* isRoot */ false, currCb)
      } else if (effect && effect[IO]) {
        // takeEvery的调用，会执行到这里，触发
        // effectRunner, effect.type 长什么样，
        // 请继续往下看
        const effectRunner = effectRunnerMap[effect.type]
        effectRunner(env, effect.payload, currCb, executingContext)
      } else {
        // anything else returned as is
        currCb(effect)
      }
   }

   // ....
}
```
```ts 
// redux-sage/packages/core/src/internal/effectRunnerMap.js 

// ....

function runTakeEffect(env, { channel = env.channel, pattern, maybe }, cb) {
  const takeCb = (input) => {
    if (input instanceof Error) {
      cb(input, true)
      return
    }
    if (isEnd(input) && !maybe) {
      cb(TERMINATE)
      return
    }
    // input就是 action， cb 就是 effect
    cb(input)
  }
  try {
    // 在这里将action.type 和 effect 注册，
    // takeCb 记录 effect，matcher记录action.type
    channel.take(takeCb, is.notUndef(pattern) ? matcher(pattern) : null)
  } catch (err) {
    cb(err, true)
    return
  }
  cb.cancel = takeCb.cancel
}

// ....

// 回答 effect.type长什么样的问题：
// 像 put take call 这样的运算符，会创建一个 Effect
// 类型的数据，该数据有个 type 属性， 该属性的值就是
// effectTypes.TAKE .... effectTypes.SET_CONTEXT
const effectRunnerMap = {
  [effectTypes.TAKE]: runTakeEffect,
  [effectTypes.PUT]: runPutEffect,
  [effectTypes.ALL]: runAllEffect,
  [effectTypes.RACE]: runRaceEffect,
  [effectTypes.CALL]: runCallEffect,
  [effectTypes.CPS]: runCPSEffect,
  [effectTypes.FORK]: runForkEffect,
  [effectTypes.JOIN]: runJoinEffect,
  [effectTypes.CANCEL]: runCancelEffect,
  [effectTypes.SELECT]: runSelectEffect,
  [effectTypes.ACTION_CHANNEL]: runChannelEffect,
  [effectTypes.CANCELLED]: runCancelledEffect,
  [effectTypes.FLUSH]: runFlushEffect,
  [effectTypes.GET_CONTEXT]: runGetContextEffect,
  [effectTypes.SET_CONTEXT]: runSetContextEffect,
}

export default effectRunnerMap
```
```ts 
// redux-sage/packages/core/src/internal/channel.js 

// 默认情况下的 channel 就是 multicastChannel
function multicastChannel() {
  // ....

  const close = () => {
    if (process.env.NODE_ENV !== 'production') {
      checkForbiddenStates()
    }

    closed = true
    const takers = (currentTakers = nextTakers)
    nextTakers = []
    takers.forEach((taker) => {
      taker(END)
    })
  }

  return {
    [MULTICAST]: true,
    put(input) {
      // ....

      const takers = (currentTakers = nextTakers)

      // input 就是 action；
      // 所有的 effect 都存储在 takers 列表中，
      // 每一个 taker 就是 effect, taker 上 
      // 有个属性[MATCH], 它可以判断 action
      // 是否匹配 taker， 匹配的话，就执行taker，
      // 也即是 effect 被执行了 
      for (let i = 0, len = takers.length; i < len; i++) {
        const taker = takers[i]

        if (taker[MATCH](input)) {
          taker.cancel()
          taker(input)
        }
      }
    },
    take(cb, matcher = matchers.wildcard) {
      // ....

      cb[MATCH] = matcher
      ensureCanMutateNextTakers()
      nextTakers.push(cb)

      cb.cancel = once(() => {
        ensureCanMutateNextTakers()
        remove(nextTakers, cb)
      })
    },
    close,
  }
}
```
<br>

### dva基于react-saga,额外做的改动：

1. 原本情况下， action.type 就是 effect 函数名或者 reducer函数名，但是 dva 给加入了 namespace 前缀，因此在dispatch触发action的时候，action.type 需要调整下 

```ts 

const M = {
  namespace: "hello",
  effects: {
    *say() {
      // ....
    }
  }
}

// 按照原本 redux-saga，要触发 say 方法 
dispatch({ type: "say" })

// dva处理后，需要
dispatch({ type: "hello/say" })
```

2. 在 effect 函数定义中，支持第二个参数获取一些内置函数访问权

```ts 
const M = {
  namespace: "hello",
  effects: {
    // 可以使用内置的 call put 方法了
    *say({ payload }, { call, put }) {
      // ....
    }
  }
}
```
实现原理如下：
```ts 
// dva/packages/dva-core/src/getSaga.js

// ....

function getSaga(effects, model, onError, onEffect, opts = {}) {
  // 这里的匿名函数就相当于上文我们给出的 rootSaga 函数了
  return function*() {
    for (const key in effects) {
      if (Object.prototype.hasOwnProperty.call(effects, key)) {
        const watcher = getWatcher(key, effects[key], model, onError, onEffect, opts);
        const task = yield sagaEffects.fork(watcher);
        yield sagaEffects.fork(function*() {
          yield sagaEffects.take(`${model.namespace}/@@CANCEL_EFFECTS`);
          yield sagaEffects.cancel(task);
        });
      }
    }
  };
}

function getWatcher(key, _effect, model, onError, onEffect, opts) {
  let effect = _effect;
  let type = 'takeEvery';
  
  // ....

  function* sagaWithCatch(...args) {
    const { __dva_resolve: resolve = noop, __dva_reject: reject = noop } =
      args.length > 0 ? args[0] : {};
    try {
      yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@start` });

      // 在这里实现的！
      // effect 就是我们的 say 方法，args就是[action],
      // createEffects的返回值就是那些内置的方法
      const ret = yield effect(...args.concat(createEffects(model, opts)));
      yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@end` });
      resolve(ret);
    } catch (e) {
      onError(e, {
        key,
        effectArgs: args,
      });
      if (!e._dontReject) {
        reject(e);
      }
    }
  }

  const sagaWithOnEffect = applyOnEffect(onEffect, sagaWithCatch, model, key);

  switch (type) {
    case 'watcher':
      // ....
    case 'takeLatest':
      // ....
    case 'throttle':
      // ....
    case 'poll':
      // ....
    default:
      return function*() {
        yield sagaEffects.takeEvery(key, sagaWithOnEffect);
      };
  }
}

// ....
```
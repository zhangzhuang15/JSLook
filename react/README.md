[toc]

## Hooks

### useMemo & useCallback
**解决什么问题**
React组件在更新的时候，会将变量再生成一次，会将函数在重新生成一次，会将函数再执行一次。

尽管更新前后两次函数名一样，功能也一样，但是函数的引用不一样，这会导致子组件跟着更新，然而这种更新是不必要的。为了解决这种不必要更新的问题，出现了useCallback。如果依赖项没有发生变化，useCallback返回的就是以前的函数引用，这样子组件就不会检测到变化，也就不会触发子组件的刷新。

变量值如果是通过执行一个函数得到的，那么也会非常糟糕，因为在组件刷新的时候，函数又会执行一次，如果这个函数计算量很大，就会造成性能问题，可实际上本次组件的刷新，并不需要重新执行一次函数。于是useMemo横空出世，把上一次结果缓存起来，如果依赖项没有发生变化，就直接返回缓存值，避免重新计算一次。


### useRef
**解决什么问题**
1. 在React组件中访问DOM节点；
2. 全局使用值；
> Ref不会重新生成一个，新Ref和旧Ref是同一个引用，只是值的内容不同;
> Ref的修改不会触发组件渲染更新, 同时意味着Ref的值发生变化时，React不会通知你；

3. 配合 `forwardRef`，访问子组件的DOM节点；

> Notice:useRef首次执行的时候，ref.current等于 initial value，在之后组件刷新时再执行的时候，
将会返回旧值


### useReducer
* useState的替代方案，使用起来非常逼近redux；
* 当state结构比较复杂，或者state要在前一状态基础上更新，useReducer就非常适合了。


### useEffect
* 第一个参数是函数；
* 函数体对应组件挂载和刷新阶段；
* 函数返回的值（注意如果有的话，也是一个函数），对应组件卸载阶段；


### useContext
**解决什么问题**
后代组件向祖先组件传递信息；
> 父子组件之间，使用props和事件可以交换信息，但是组件和孙子组件可能就不太合适了

```tsx
// App.tsx
const AppContext = React.createContext(null);
const [app, dispatch] = useReducer(null);
return (
    <AppContext.Provider value={dispatch}>
      <Child>
        <GrandChild></GrandChild>
      </Child>
    </AppContext.Provider>
);
```
```tsx
// GrandChild.tsx
function GrandChild(props) {
    const dispatch = useContext(AppContext);

    // Great🌟
    // 之后你就可以使用 dispatch 向 App.tsx 中的组件发送信息了
}
```

### useLayoutEffect
当你想在页面更新之后，对页面的DOM元素做一些操作，你就可以使用这个hook

## Server Side Rendering
[jump](https://www.bilibili.com/video/BV1MS4y167Bz?p=11&vd_source=8e22a21e39978743c185c338fa9b6d6d)
 
- `renderToString` from "react-dom/server"
- `React.hydrate` instead of `React.render` in client-side code
- `StaticRouter` in server-side code 
- `BrowserRouter` in client-side code 
- initial data context both two side

## Terms
 HOC( Higher-Order Component) 高阶组件


## Interview
[jump](../面经/react/README.md)


## Redux 
[jump](../面经/react/redux.md)

## Architecture of React App 
### React Router
#### lazy component 
```tsx 

import { lazy, Suspense } from "React";

const ChildComponent = lazy(() => import("./components/ChildComponent"));

const Component = (props) => {
  return (
  <>
    <Suspense fallback={<p>loading...</p>}>
      <ChildComponent />
    </Suspense>
  </>)
}
```
### SSR 
### State Management
Feature:
  - loading data
  - storing data
  - persisting data
  - sharing data 

How to do:
- useState hook
- Context 
- Recoil
- Redux 
- MobX


## ErrorBoundary
```tsx 
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null
    }
  }

  componentDidCatch(error, errorInfo) {
    console.log("error: ", error)
    console.log("errorInfo: ", errorInfo)
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <p>wrong</p>
    }

    return this.props.children;
  }
}
```

```tsx 

const Component = () => {
  return (
  <ErrorBoundary>
     <SubComponent />
  </ErrorBoundary>
  )
}
```
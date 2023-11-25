[toc]

## what
基于 vue 框架的一个前端路由管理器，本质上就是一个vue插件。

## core component
**HistoryAPIProvider**: 驱动路由变化。
提供三种实现：
- `WebHistory` 
- `WebHashHistory`
- `MemoryHistory(SSR)`

**RouterView**: vue组件，感知路由变化，渲染对应的内容

**RouterLink**: vue组件，提供点击跳转功能，本质是监听点击事件，调用 **HistoryAPIProvider**提供的API

**currentRoute**: 响应式变量，记录当前路由的信息，负责将路由的变化传递给**RouterView**，自身值的更新由**router**完成 

**router**: vue插件
- 注册**RouterView** **RouterLink**，令其可全局使用
- 提供**currentRoute**，令**RouterView**可以调用inject得到
- 调用**HistoryAPIProvider**，负责前端路由控制的重点逻辑（包含currentRoute更新）

## 关于 `history` `location` 的资料补充
[react-router 官网的解释](https://reactrouter.com/en/main/start/concepts#history-and-locations)

## 编程技巧
### 前端的宏替换
使用`@rollup/plugin-replace`插件完成。比如源码中的`__DEV__`就会在编译时被替换为正确的值，就像C语言的宏一样。

### SetUp-CleanUp
```ts 
function setState() {
    /** 
     * some codes setting the state， called SetUp 
     */

    return () => {
        /**
         * some codes canceling setting the state upwards, called CleanUp
         */
    }
}

// 像setState函数这样的代码模式，就是 SetUp-CleanUp
```
应用案例：
- 添加listener，删除listener
- 添加订阅者，取消订阅者

## FAQ
### 前端路由发生变化的时候，如何触发页面更新？
#### 基本分析
前端路由发生变化，主要通过以下方式触发：
- 点击浏览器的 前进/后退 按钮
-  `history.go()` 
-  `history.back()` 
-  `history.forward()`
-  `history.pushState()`
-  `hisotry.replaceState()`

直接修改url，按下回车，会向后端发送请求，不属于前端路由变化的情形，因此不考虑在内。

监听window的**popstate**和**beforeunload**事件

```ts 
// 点击前进、后退按钮；
// history.go()
// history.forward()
// history.back()
// 会触发 popState 事件
window.addEventListener('popstate', popStateHandler)

// 发送请求，重新加载当前页面；
// 发送请求，加载新的页面；
// 会触发 beforeunload 事件；
window.addEventListener('beforeunload',beforeUnloadListener, { passive: true })
```

popStateHandler完成的事情：
- 更新history.state缓存
  > 该事件的event.state表示的是进入的页面的state，不是离开的页面的state，为了同时知道离开的页面的state，需要使用一个变量去存储，也就是history.state的缓存
- 更新url缓存
  > 在该事件回调函数中，调用location只能查询进入的页面的url，没办法知道离开的页面的url，需要使用一个变量去存储，也就是url的缓存
- 执行listeners函数队列
  > listeners中的listener函数，是动态插入的，插入的时机发生在router的install的push方法中
  ```ts 
  // this initial navigation is only necessary on client, on server it doesn't
  // make sense because it will create an extra unnecessary navigation and could
  // lead to problems
  if (
    isBrowser &&
    // used for the initial navigation client side to avoid pushing
    // multiple times when the router is used in multiple apps
    !started &&
    currentRoute.value === START_LOCATION_NORMALIZED
  ) {
      // see above
      started = true
      push(routerHistory.location).catch(err => {
          if (__DEV__) warn('Unexpected error when starting the router:', err)
        })
    }
  ```
  ```ts 
  function push(to: RouteLocationRaw) {
    return pushWithRedirect(to)
  }
  ``` 
  ```ts 
  function pushWithRedirect(
    to: RouteLocationRaw | RouteLocation,
    redirectedFrom?: RouteLocation
  ): Promise<NavigationFailure | void | undefined> {
    // 省略无关代码

    return (failure ? Promise.resolve(failure) : navigate(toLocation, from))
      .catch((error: NavigationFailure | NavigationRedirectError) => {

        // 省略无关代码

      })
      .then((failure: NavigationFailure | NavigationRedirectError | void) => {
        if (failure) {

          // 省略无关代码 

        } else {
          // if we fail we don't finalize the navigation
          failure = finalizeNavigation(
            toLocation as RouteLocationNormalizedLoaded,
            from,
            true,
            replace,
            data
          )
        }
        
        // 省略无关代码 

        return failure
      })
  }
  ```
  ```ts 
  function finalizeNavigation(
    toLocation: RouteLocationNormalizedLoaded,
    from: RouteLocationNormalizedLoaded,
    isPush: boolean,
    replace?: boolean,
    data?: HistoryState
  ): NavigationFailure | void { 
    // 省略无关代码  

    // 这行代码使得url的变化可以被 RouterView 组件感知，
    // 进而完成组件的更新
    currentRoute.value = toLocation

    // 省略无关代码 

     markAsReady()
  }
  ```
  ```ts 
  function markAsReady<E = any>(err?: E): E | void {
    if (!ready) {
      // still not ready if an error happened
      ready = !err

      // 就是在这里动态引入listeners的！
      // 有了ready，这里的代码只会执行一次，
      // 以后再调用 markAsReady 的时候，
      // 不执行任何代码
      setupListeners()

      readyHandlers
        .list()
        .forEach(([resolve, reject]) => (err ? reject(err) : resolve()))
      readyHandlers.reset()
    }
    return err
  }
  ```
  ```ts 
  let removeHistoryListener: undefined | null | (() => void)

  function setupListeners() {
    // 省略无关代码

    removeHistoryListener = routerHistory.listen((to, _from, info) => {
        if (!router.listening) return
        // cannot be a redirect route because it was in history
        const toLocation = resolve(to) as RouteLocationNormalized

        // due to dynamic routing, and to hash history with manual navigation
        // (manually changing the url or calling history.hash = '#/somewhere'),
        // there could be a redirect record in history
        const shouldRedirect = handleRedirectRecord(toLocation)
        if (shouldRedirect) {
          pushWithRedirect(
            assign(shouldRedirect, { replace: true }),
            toLocation
          ).catch(noop)
          return
        }

        pendingLocation = toLocation
        const from = currentRoute.value

        // TODO: should be moved to web history?
        if (isBrowser) {
          saveScrollPosition(
            getScrollKey(from.fullPath, info.delta),
            computeScrollPosition()
          )
        }

        navigate(toLocation, from)
            .catch(/** 省略无关代码 */)
            .then((failure: NavigationFailure | void )=> {

                /** 省略无关代码 */ 

                failure = failure ||
                    finalizeNavigation(
                        // after navigation, all matched components are resolved
                        toLocation as RouteLocationNormalizedLoaded,
                        from,
                        false
                    )

                /** 省略无关代码 */

            })
    }
  }
  ```
  > 在 listen 逻辑中，只是做了一堆处理，然后调用封装好的函数，驱动前端路由做出改变，但是路由发生改变后，RouterView组件是怎么感知到的呢？


路由变化传递给RouterView组件：
```ts 
  // RouterView组件的实现

  export const RouterViewImpl = /*#__PURE__*/ defineComponent({
    name: 'RouterView',
    // 省略无关代码 
    setup(props, { attrs, slots }) {

      const injectedRoute = inject(routerViewLocationKey)!

      const routeToDisplay = computed<RouteLocationNormalizedLoaded>(
        () => props.route || injectedRoute.value
      )

      const matchedRouteRef = computed<RouteLocationMatched | undefined>(
        () => routeToDisplay.value.matched[depth.value]
      )

      watch(
        () => [viewRef.value, matchedRouteRef.value, props.name] as const,
        ([instance, to, name], [oldInstance, from, oldName]) => {
            // 省略无关代码
        },
        { flush: 'post' }
      )

      return () => {
        // 省略无关代码

        const matchedRoute = matchedRouteRef.value

        // 省略无关代码

        const routePropsOption = matchedRoute.props[currentName]
        const routeProps = routePropsOption
          ? routePropsOption === true
            ? route.params
            : typeof routePropsOption === 'function'
            ? routePropsOption(route)
            : routePropsOption
          : null

        // 省略无关代码

        const component = h(
          ViewComponent,
          assign({}, routeProps, attrs, {
            onVnodeUnmounted,
            ref: viewRef,
          })
        )

        // 省略无关代码
      }
    }
  })
```
上述代码从下往上看，可以得到这样的结论:
- routeProps更新的时候，RouterView组件就会更新
- matchedRoute更新的时候，routeProps就会更新
- matchedRouteRef更新的时候，matchedRoute就会更新
- routeToDisplay更新的时候，matchedRouteRef就会更新
- injectedRoute更新的时候，routeToDisplay就会更新
  > 注意，props.route 如果拦截了，说明RouteView是可控组件，路由完全交给开发者控制，而我们讨论的是路由变化，开发者什么都不做，怎么将变化传递给RouterView组件

问题来到了
```ts 
injectedRoute = inject(routerViewLocationKey)!
```
既然是 inject, 那么 provide 发生在哪里呢？

```ts 
// router的实现 

function createRouter(options: RouterOptions): Router {
    // 省略无关代码

    const currentRoute = shallowRef<RouteLocationNormalizedLoaded>(
      START_LOCATION_NORMALIZED
    )

    // 省略无关代码

    const router: Router = {
      // 省略无关代码
      
      install(app: App) {
        const router = this

        // 这里交代了为什么可以直接使用RouterLink和RouterView组件
        app.component('RouterLink', RouterLink)
        app.component('RouterView', RouterView)

        // 这里交代了为什么会有 this.$router
        app.config.globalProperties.$router = router

        // 这里交代了为什么会有 this.$route,
        // 而且这个值与 currentRoute 保持同步更新
        Object.defineProperty(app.config.globalProperties, '$route', {
          enumerable: true,
          get: () => unref(currentRoute),
        })

        // 省略无关代码

        // 哈哈哈，找到了，就在这里provide
        app.provide(routerViewLocationKey, currentRoute)

        // 省略无关代码
      },

      // 省略无关代码

    }

    // 省略无关代码
}

```
currentRoute 更新了，injectedRoute就会更新，进而令RouterView更新；

每次更新路由的时候，都会执行这个函数：
```ts 
  function finalizeNavigation(
    toLocation: RouteLocationNormalizedLoaded,
    from: RouteLocationNormalizedLoaded,
    isPush: boolean,
    replace?: boolean,
    data?: HistoryState
  ): NavigationFailure | void { 
    // 省略无关代码  

    // 这行代码使得url的变化可以被 RouterView 组件感知，
    // 进而完成组件的更新
    currentRoute.value = toLocation

    // 省略无关代码 

     markAsReady()
  }
```
currentRoute也就更新了。

梳理一下全过程：
- 调用vue-router封装好的API，触发前端路由变化
- 前端路由变化如果触发popstate事件函数，会调用封装好的navigate函数，更新 currentRoute
- 前端路由变化如果没有触发popstate事件函数，依旧会调用封装好的navigate函数，更新 currentRoute
- currentRoute是响应式的，其更新会传递给 RouterView 组件，于是组件更新

#### 监听hash变化的情形
上一小节，讲述的是`WebHistory`的方案，而`WebHashHistory`没有给出`hashchange`的事件监听，而是复用了`WebHistory`的方案。

主要原因是popstate事件和history API 的浏览器兼容程度更好。

### MemoryHistory实现的思路
所谓History对象，就是要提供和原生history一样的API，控制前端路由，这样既能完成原生history的路由控制功能，而且可以扩展原生API，将必要的逻辑处理注入。

而MemoryHistory对象，并没有封装原生History API，而是使用内存中的队列数据结构，模拟History栈，并提供和原生History一样的API签名，修改队列。

### 为什么响应式变量更新后，vue组件会更新？

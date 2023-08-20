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


## 编程技巧
待补充

## FAQ
### 路由发生变化的时候，如何触发页面更新？
#### 点击 前进/后退
调用以下API也同理:
-  `history.go()` 
-  `history.back()` 
-  `history.forward()`

直接修改url，按下回车的情形，也同理。

监听window的**popstate**和**beforeunload**事件

```ts 
window.addEventListener('popstate', popStateHandler)

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
- 路由变化的时候，执行popstate事件函数
- 在该事件函数中会调用封装的navigate函数，执行一些守卫函数，但最重要的是更新 currentRoute
- currentRoute是响应式的，其更新会传递给 RouterView 组件，组件于是更新

#### 监听hash变化的情形
上一小节，讲述的是`WebHistory`的方案，而`WebHashHistory`没有给出`hashchange`的事件监听，而是复用了`WebHistory`的方案。

**这样做的根据**：

如果hash是通过浏览器人机交互的方式修改的，那么popstate事件也会被触发，无需监听hashchange事件；

如果hash是通过API修改的，因为vue-router已经封装好API供用户使用，用户操作正常的话，一定是通过vue-router的API驱动路由改变，而不是用原生的API，路由变动就可以被API本身拦截到了，无需做任何事件监听。

### 为什么响应式变量更新后，vue组件会更新？

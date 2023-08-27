[toc]

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
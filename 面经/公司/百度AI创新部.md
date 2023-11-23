## 一面

### useLayoutEffect 和 useEffect 的区别

### classComponent 和 functionComponent 的区别 

### 浏览器输入 url 后，按下回车，发生了什么

### 用过哪些hooks，useRef 在哪些场景下用过

### 都用 useEffect 做过什么

### 有没有遇到 cors 问题，为什么会有cors问题，怎么去解决的

### 编程题： 数组排序
```js 
const sort = (array, start, end) => {
    const dest = array[end];
    let cur = start;
  
   
        for (let i = start ; i < end; i++) {
            if (array[i] <= dest) {
                continue;
            } else {
                cur++;
                const v = array[i];
                array[i] = array[cur];
                array[cur] = v;
            }
        }

    

    cur++;
    array[end] = array[cur];
    array[cur] = dest;
    sstart = 
   
    sort(array, start, cur-1);
    sort(array, cur + 1, end);
}

const f = (array) => {
    sort(array,0, array.length - 1);
}

const t = [1,4,2,7,6];
f(t)
console.log(t);
```

## 二面
### 说说React里的状态管理工具 

### vue和react你更喜欢哪个，为什么？

### 说一下websocket里的ping-pong机制，websocket断开连接的时候，怎么去处理的？除了websocket方案，还有什么方法可以将数据从后端主动推向前端？

### 编程题：反转单向链表 

### 实现一个自定义的hook，只在组件第一次渲染的时候返回true，其余返回false
```js 
// 面试官给出的实现版本
const isFirstRender = () => {
    const isFirstRef = useRef(true);

    const isFirst = isFirstRef.current;

    if (isFirst.current) {
        isFirst.current = false;
    }

    return isFirst;
}
```

```js 
// 我的版本
const isFirstRender = () => {
    const isFirstRef = useRef();

    useEffect(() => {
        isFirstRef.current = true;
    }, []);

    useEffect(() => {
        return () => {
            isFirstRef.current = false;
        }
    });

    return isFirstRef;
}
```
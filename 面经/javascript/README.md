### javascript中原始的数据类型有哪些？
* boolean
* string
* number
* bigint
* null
* undefined
* symbol

<br>

### Symbol有了解吗，迭代器有了解吗，哪些是可迭代的？
Symbol: 
* 充当对象的属性名，实现私有属性；
* 充当变量，实现单独变量；
* 用于定义类的私有属性；
* 不能与其他类型的值运算；
* 不可以和其他类型的值进行混合运算；
* 作为属性名，不能用点运算访问；
* 在对象内部使用Symbol 值作为属性名的时候，必须要将值放在方括号中；

可迭代对象：
Array、Set、Map，想将不可迭代对象转换为可迭代对象，要设置Symbol.iterator属性
```javascript
// example
   const t = {
       name: 'jack',
       age: 24
   }

   t[Symbol.iterator] = function() {
       let index = 0
       let self = this
       let keys = Object.keys(this)

       return {
           next() {
               if(index < keys.length) {
                   return {
                       value: self(keys[index++]),
                       done: false
                   }
               } else {
                   return {
                       value: undefined,
                       done: true
                   }
               }
           }
       }
   }

   for (let value of t) {
       console.log(value)
   }
```

<br>


### ajax的请求是同步的还是异步的？
* 默认情况下是异步的；
* 也可以设置为同步的；
```javascript
   
   const req = new XMLHttpRequest()
   // false 指定请求是同步的
   req.open('GET', 'https://www.baidu.com', false)
   req.send() // 服务端返回响应后，阻塞解除
```

### 实现求解数组的并集、交集、差集
```javascript

// 求并集
function union(arrayA, arrayB) {
    return Array.from( new Set(arrayA.concat(arrayB)) )
}

// 求交集
function interpolate(arrayA, arrayB) {
    return Array.from( 
        new Set( arrayA.filter( 
            item => arrayB.indexOf(item) > -1
            )
        )
    )
}

// 求差集
function differ(arrayA, arrayB) {
    return Array.from( 
        new Set( arrayA.filter(
            item => arrayB.indexOf(item) == -1
            )
        )
    )
}
```

<br>


### for 和 forEach 的区别 
* for 是js中循环控制的语法， forEach 是js中遍历可迭代对象的迭代器；
* for 中支持 break continue， forEach 中不支持；
* for 可以控制循环的起点，但是 forEach 不能；
* for 性能比 forEach 好， forEach 性能比 map 好；
  
<br>

### 如果有个数据量比较大的任务，使用什么样的方案，能让该任务不会占据主线程？
使用 web worker API，web worker会在主线程之外创建一个子线程，子线程的计算任务，
不会影响到主线程的工作。
> 这只适用于将一些对及时反馈要求不高的计算放到子线程中计算。

<br>

### 请解决如下问题
```
题目：
    给你一个字符串 path，将它转换为合理的 unix 路径字符串

    比如：
    //             转换为     /
    /a/            转换为     /a
    /a/./b         转换为     /a/b
    /a/../b        转换为     /b
    /a/.../b       转换为     /a/b
    /a/......../b  转换为     /a/b
    ../../         转换为     /
```
```javascript
function resolvePath(path) {
    const reg = /\.\.+/
    const paths = path.split('/')
    let resolvePaths = []

    for (let index = 0; index < paths.length; index += 1) {
        let token = paths[index]
        
        if (token == '' || reg.test(token) || token == '.') continue
        else if (token == '..') resolvePaths.pop()
        else resolvePaths.push(token)
    }

    return '/' + resolvePaths.join('/')
}
```

<br>


### 判断下面代码
```javascript
const a = Symbol('a')
const b = Symbol('a')
const m = Symbol.for('b')
const n = Symbol.for('b')

console.log(a == b)    
console.log(m == n)

const p = new Symbol()
```  
结果：  
false  
true  
报错  

> Symbol 没有构造函数，无法使用 new；  
> Symbol.for('b') 会寻找有没有现成的 symbol , 如果没有就
> 新建一个，否则就返回现有的

<br>

### javascript中的可迭代对象有哪些？
*  Map  
*  Set  
*  Array  
*  String  
*  TypedArray  
*  Arguments  

<br>

### 手动实现一个 instanceOf 函数
```javascript

function _instanceOf(obj, func) {
    // obj 必须是 object 或者 function， 而且不能是 null
    if(obj == null || !['object', 'function'].includes(typeof obj)) {
        return false
    }

    while(obj = Object.getPrototype(obj)) {
        if(obj == func.prototype) {
            return true
        }
    }
    return false
}
```

<br>

### 下面的代码运行结果是多少？
```javascript
var m = '10' + 3 - '1'
console.log(m)
```
> 结果是102;  
> '10' + 3 将按照字符串计算得到 '103';  
> '103' - '1' 将按照number计算得到 102；

<br>

### 箭头函数和普通函数如何获取可变参数
```javascript
const callback = (self, ...args ) => {
    // 可变参数打包进入 args 数组中;
    // 箭头函数内部不存在 arguments;
}

const call = function(self, ...args) {}

const hello = function(self) {
    // arguments 是类数组，但不是数组，它没有 slice方法；
    // [...arguments] 将 arguments 转换成一个数组，之后就可以使用slice；
    const args = [...arguments].slice(1)
}
```
```javascript
callback(self)   // args = []
hello(self)      // args = []
```

<br>

### javascript中的全局函数有哪些
* `escape()` `unescape()`
* `encodeURI()` `decodeURI()`
* `encodeURIComponent()` `decodeURIComponent()`
* `Number()` `String()`
* `isFinite()` `isNaN()` 
* `parseFloat()` `parseInt()`
* `eval`
  
<br>

### 一个单向链表，如何排序
* 暴力解法。每次遍历寻找一个最小的节点，将该节点插入到头节点，之后从头节点的下一个节点开始下一次遍历。
* 从第一个节点遍历，按照顺序插入到一个新的单向链表中。

<br> 


### 关闭浏览器或者关闭标签页，cookies还会存在么？ cookies的生命周期是怎样的？
```javascript

// 打开网页A的console
document.cookie="name=zhang"

// 关闭网页A，再重新打开网页A
document.cookie      // 可以查看到 name=zhang

// 关闭浏览器，重新打开浏览器, 进入网页A的console
document.cookie     //  无法看到 name=zhang

// 默认情况下，cookie的生命周期是 session，当你关闭浏览器的时候，就会删除。

// document.cookie 的生命周期主要是根据 max-age 和 expires 决定的
// max-age优先级更高

document.cookie = "name=zhang;max-age=0"   // 删除name=zhang

document.cookie = "name=zhang;expires=Thu, Mar 17 2022 02:00:00GMT" // 2022-03-17 02:00:00过期，才会被删除

// expires必须是GMT格式的字符串，
// new Date().toUTCString() 或者 new Date().toGMTString() 可以获取GMT格式字符串
// 在google浏览器的application中，expires是按照ISO格式展示的


document.cookie = "name=zhang;httponly=true" // 无法使用document.cookie访问name=zhang , 在google浏览器的application中也看不到

// 假设你位于http://www.pp.com/
document.cookie="name=zhang;path=/jack"

// 你只能在 http://www.pp.com/jack的网页 打开console，document.cookie才能查到name=zhang;


// 获取cookie中的信息
document.cookie.match(new RegExp(`${key}=(?<value>.*?)(;|$)`)).groups.value
```

<br>

### 给出数组中的元素有哪些
```javascript
let list = [10, 20, 30]
list.unshift(40, 50)
list.pop()
list.push(70, 80)
```
> 40, 50, 10, 20, 70, 80  
> 最具有迷惑性质的就是unshift那行代码；  
> 这行代码不等效于 `list.unshift(40);list.unshift(50)`;  
> 而是直接将 40 50 插入到开头

<br>

### 如何在浏览器中禁止鼠标右键出现菜单栏选项？
```html
<body oncontextmenu="return false" > ... </body>
```

<br>

### `event.target` 和 `event.currentTarget` 的区别
* `event.target` 指的是事件发生时所在的对象；
* `event.currentTarget` 指的是添加该事件监听器的对象；
  
```html
 <ul id="ulist"> 
     <li> hello </li>
 </ul>

 <script>
     var ul = document.getElementById('ulist')
     ul.addEventListener('click', e => {})
 </script>
 <!-- 当你点击 hello 时，click事件发生，e.target 指的是 li，
      e.currentTarget 指的是 ul 。-->
```

<br>

### json 和 xml 的差异
* json数据体积较小，传输速度更快；
* json可读性更高，与javascript交互更方便；
* xml对数据的描述更详细；

<br>

### 如何获取用户的地理位置 
```javascript

navigator.geolocation.getCurrentPosition(
    geolocation => {
        const coords = geolocation.coords
        console.log('纬度: ' + coords.latitude)
        console.log('经度： ' + coords.longitude)
    },
    err => {
        console.err('获取位置失败: ' + err)
    }
)
```

<br>

### result的结果是多少？
```javascript
const result = Math.round(11.5) + Math.round(-11.5)
```
> result: 12-11=1  
> Math.round(11.4) == 11  
> Math.round(11.5) == 12  
> Math.round(11.7) == 12  
> Math.round(-11.2) == -11  
> Math.round(-11.5) == -11  
> Math.round(-11.6) == -12

<br>

### 如何实现，当某个元素出现在视野中时做出一些动作？
```javascript
const options = {
    root: null,        // 作为 viewport 的 element，设置为null，选择浏览器viewport作为可视窗口
    rootMargin: '0px', // 设置计算intersection时，root的 margin的补充值
    threshold: 0.2     // root中的元素出现在root中的比例每变化20%时，触发intersection回调一次
}
function handleIntersect(entries) {
    // entry 代表每个被observe的 元素
    entries.forEach( entry => {
        if(entry.intersectionratio > 0.7) {
            // element就是出现在 root中的 元素
            element = entry.target
            // 处理element
        }
    })
}
const observer = new IntersectionObserver(handleIntersect, options)
const element = document.getElementById('jack')
observer.observe(element)
```

<br>


### 浏览器端和node环境下js执行的差异
在 node11之后，二者在结果不存在差异；  
在 node11之前，差异如下：
```
浏览器端：
存在宏任务和微任务队列，js脚本自身作为宏任务理解。
执行js脚本，遇到同步代码，立即执行；
遇到宏任务，将其加入到宏任务队列中；
遇到微任务，将其加入到微任务队列中。
执行微任务队列中的所有微任务，进入事件循环中。
从宏任务队列中取出一个宏任务执行，
遇到同步代码就执行，
遇到宏任务就加入到宏任务队列中，
遇到微任务就加入到微任务队列中，
当前宏任务执行完毕后，依次取出微任务队列中的所有微任务执行。
进入到下一个事件循环中。

宏任务： setTimeout setInterval IO requestAnimationFrame
微任务： Promise mutationObserver
```
```
node环境：
存在若干阶段，每个阶段有对应的宏任务和微任务队列。
执行js脚本，遇到同步代码，立即执行；
遇到宏任务，将其加入到对应阶段的宏任务队列中；
遇到微任务，将其加入到对应阶段的微任务队列中；
当前js脚本执行的微任务可以认为有单独的一个微任务队列。
取出当前js脚本对应的微任务队列中的所有微任务执行。
进入事件循环。
按照阶段，先进入timers阶段，
取出宏任务队列中的一个到期宏任务执行，
遇到微任务加入本阶段的微任务队列中，process.nextTick是微任务，且优先级比Promise高；
遇到宏任务就加入到本阶段的宏任务队列中；
当本阶段的宏任务队列中的到期宏任务全部执行完毕，执行微任务队列中的所有微任务。
进入到下一个阶段。

宏任务： setTimeout setInterval IO setImmediate
微任务： Promise process.nextTick()
```

<br>

### module.exports 和 export 的差异
* module.exports 导出的是值，因此在 require的时候可以任意取名；
* export 导出的是引用，因此在 import 的时候名字要和export一致。
* export 是 es6， module.exports 是 commonJS；

<br>

### 提高DOM元素操作效率的方法
* 处理列表子元素的点击事件，采用事件代理
* 插入大量DOM元素，使用innerHTML 替代逐个构建元素
* 使用 DocumentFragment 替代多次appendChild操作


<br>

### DOM模型中都分为哪些类型的节点？
* Element节点
  > 所有的 HTML Element 都是 Element节点
* Text节点
* Comment节点
* document节点
  > document既是一种节点格式，也是 document节点。

<br>

### 下面代码的输出结果是多少？
```javascript

let obj = { num1: 117 }

let res = obj

obj.child = obj = { num2: 935 }

var x = y = res.child.num2

console.log(obj.child)
console.log(res.num1)
console.log(y)
```
结果：  
undefined  
117  
935  

*分析：*
>  obj ->  { num1: 117 }  
>  res -> { num1: 117 }  
>  执行 obj.child = obj = { num2: 935 }，现从左到右定义变量，再从右往左赋值。  
>  从左到右定义变量，  
>  obj -> { num1: 117, child: undefined }, res -> { num1: 117, child: undefined}  
>  从右向左赋值，  
>  obj -> { num2: 935 }, res -> { num1: 117, child: { num2: 935} }  
> 
>  因此有obj.child = undefined, res.num1 = 117, y = 935 

<br>

### 下面代码的结果是多少？
```javascript
var a = 10
function a(){}
console.log(typeof a)
```
结果: 'number'
> 函数变量提升优先于变量，上述等价于：
> ```javascript
>  function a(){}
>  var a 
>  a = 10
>  console.log(typeof a)
>  ```

<br>

### 下面代码中的catch会执行嘛？
```javascript

try {
    var a = 0
    var b = 0/a
} catch(e) {
    console.log(e)
}
```
不会执行。
> 任何非零数据除以0，结果是 infinite；  
> 0除以0得到的是 NaN；  
> 不会引发异常；


<br>

### 编程题
```javascript
// 给定一个不重复整数的数组，和一个目标值，求出所有子元素，他们的和等于目标值
// example：
//   arr = [1, 2, 3, 4]
//   target = 3
//   result = [[1,2], [3]]

function find(arr,  target) {
    if(arr.length == 0) return []
    const result = []
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] === target) result.push([target])
        else if(arr[i] > target) continue
        else {
            const temp = find(arr.slice(i+1), target - arr[i])
            result.push([target, ...temp])
        }
    }
    return result
}
```

<br>

### 触摸事件有哪些？
* touchstart
  > 手指放在触摸屏上触发 
* touchmove
  > 手指在触摸屏上移动时触发
* touchend
  > 手指离开触摸屏时触发
* touchcancel
  > 系统取消触摸事件时触发
  
<br>

### 下面代码的结果 
```javascript
    console.log(1+ "2"+"2");
    console.log(1+ +"2"+"2");
    console.log("A"- "B"+"2");
    console.log("A"- "B"+2);
```
结果：  
122  
32  
NaN2  
NaN   

解析：
> 1+ +"2"，+"2"会转化为2，结果得3，3+“2”得到32；  
> “A” - "B" 得到 NaN，NaN + “2” 的结果是 "NaN2";  
> "A" - “B” 得到 NaN，NaN + 2 的结果是 NaN；

<br>

### 下面代码的输出是多少？
```javascript
    var b = 3;
    (function(){
        b = 5;
        var b = 2;
    })();
    console.log(b);
```
结果:  
3  

分析：
> b = 5; var b = 2 出现变量提升，  
> 等效为 var b; b = 5; b = 2;  
> 不会发生错误。但是也不会污染外面的变量b。  
> 因此打印出来的还是 3.


<br>

### 解释下面代码的结果
```javascript
parseInt(0.0000005)  // 输出 5
parseInt(999999999999999999999)  // 输出 1
```
*解释*  
1. `parseInt(0.0000005)`
   1. `0.0000005` 会被转换为字符串，得到 `"5e-7"`
   2. `parseInt`执行，打印合法数字字符，遇到字符`e`就会停止，于是只得到`5`
   
2. `parseInt(999999999999999999999)`
   1. `999999999999999999999`会被转换为字符串，得到`1e+21`
   2. `parseInt`执行, 和上边的情形一样，只得到 `1`
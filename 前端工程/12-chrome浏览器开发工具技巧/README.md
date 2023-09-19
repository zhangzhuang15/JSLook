## 重新发送请求
1. 选择 `Network`
2. 选择 `XHR/FETCH`
3. 选择要重发的请求，右键，选择`Replay XHR `


## 在控制台重发请求
1. 选择 `Network`
2. 选择 `XHR/FETCH`
3. 选择要重发的请求，右键，选择`Copy as fetch `
4. 切换到控制台，command + V, 回车


## 复制复杂的对象
1. 在控制台找到要复制的对象p；
2. 执行 `copy(p)`;
3. command + V;

## 控制台获取选中的element元素
1. 在 `Element`中单击选中 element元素；
2. 在控制台中执行 `$0`;

## 选择element元素
通常做法是使用 document.querySelector 和 document.querySelectorAll.

*新方法*
1. 用 `$()` 代替 document.querySelector;
2. 用`$$()` 代替 document.querySelectorAll;

## 截取全屏网页
通常做法是使用系统截图程序或着微信截图。但是这样的截图最大只能截图屏幕大小的区域，超过屏幕的区域截取不到。

*新方法*
1. `command + shift + p`, 浏览器会弹出一个框；
2. 输入或者选择 `Capture full size screenshot`, 回车执行;


## 一下子展开所有element元素
当element元素后代元素很多时，我们要一点一点展开，非常麻烦，
现在我们一键展开：
`option + click` 选中最外层的element元素

## 控制台使用上次结果
```javascript {.line-numbers}
const box = "123456"
box.split('')  // ['1', '2', '3', '4', '5', '6']

// 控制台是一行代码一行代码输入执行的，如果我们要对 第2行代码结果
// 做一些操作，我们就要再用一个变量记录 ['1', '2', '3', '4', '5', '6']

// 但是，我们不需要这样啦，
// 直接使用 $_ 就可以得到 ['1', '2', '3', '4', '5', '6']；
// $_ 总是记录上一条代码的执行结果。
```
[toc]

## javascript内存泄漏的场景
### 全局变量的滥用
全局变量在浏览器中是全局可访问的，如果不正确地使用，它们可能会导致内存泄漏。例如，如果你在代码的不同部分不经意地引用了全局变量，那么这些变量将一直存在，即使它们不再需要。

### 闭包
JavaScript的闭包可能会导致内存泄漏，尤其是在循环中创建闭包时。如果闭包引用了外部函数的变量，而这个变量又比较大，那么即使外部函数已经执行完毕，这个变量仍会保留在内存中，因为闭包还需要访问它。

解决方法：
- 采用`setup-cleanup`的闭包设计，在不使用闭包的情况下，调用cleanup，释放掉内部引用
- 闭包内使用`WeakMap`或`WeakSet`持有外部引用

### 定时器
如果你使用了定时器（如 setInterval 或 setTimeout），并且没有正确地清除它们，那么它们可能会导致内存泄漏。每个定时器都会创建一个新的闭包，如果定时器一直运行，或者定时器的回调函数引用了外部的变量，那么这些闭包和变量可能会一直存在内存中。

### DOM引用
如果你保留了对已经从DOM中删除的元素的引用，这些元素将不会被垃圾回收机制清除，从而导致内存泄漏。

### 事件监听器
如果事件监听器没有被正确地移除，或者事件监听器的回调函数引用了外部的变量，那么这些回调函数和变量可能会一直存在内存中。

## 排查内存泄漏的方式
### 使用浏览器的开发者工具
大多数现代浏览器都有内置的开发者工具，其中包括内存分析工具。这些工具可以帮助你找出哪些对象占用了最多的内存，以及这些对象是由哪个脚本创建的。

### 使用内存快照
如果你已经创建了一个内存泄漏，你可以使用浏览器的内存分析工具来创建一个内存快照。然后你可以比较快照来找出哪些对象占用了最多的内存，以及这些对象是由哪个脚本创建的。

### 使用内存剖析工具
有一些专门的JavaScript剖析工具（如Chrome的Heap Profiler）可以帮助你找出哪些对象占用了最多的内存，以及这些对象是由哪个脚本创建的。
## 关于拖拽的事件


### 被拖拽的元素

含有属性 draggable="true" 的元素，就是被拖拽元素。

<br>

**被拖拽元素身上的事件：**

“dragstart”
> 刚被拖拽时，触发

“drag”
> 在拖拽期间按照一定频率触发

"dragend"
> 释放鼠标，放下被拖拽的元素时，触发


<br>

**放置区身上的事件：**

"dragenter"
> 被拖拽的元素进入放置区时，触发

"dragover"
> 被拖拽的元素在放置区内移动时，触发；  
> 必须使用event.preventDefault()，因为默认状态下会将被拖拽元素放置回原位置；

"dragleave"
> 被拖拽的元素离开放置区时，触发

"drop"
> 被拖拽的元素在放置区被放下时，触发；  
> 必须使用event.preventDefault(),因为默认状态下被拖拽元素占据整个页面；
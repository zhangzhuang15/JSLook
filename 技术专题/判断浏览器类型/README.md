```javascript

   // 代码运行在浏览器环境中
  
   const userAgent = navigator.userAgent

   if (userAgent.indexOf('Chrome') > -1) {  return  'Google浏览器' }

   if (userAgent.indexOf('Safari') > -1) { return 'Safari浏览器' }

   if (userAgent.indexOf('Edge') > -1) { return 'Edge浏览器' }

   if (userAgent.indexOf('OPR') > -1 || 
       userAgent.indexOf('Opera') > -1 ) { return 'Opera浏览器' }

   if (userAgent.indexOf('Firefox') > -1) { return 'firefox浏览器' }

   // 这个判断必须处于 Opera 浏览器后边！
   // 也就是在确认不是 Opera 浏览器之后判断 IE 浏览器；
   // 具体原因应该和这两个浏览器的历史有关系吧。
   if (userAgent.indexOf('.Net') > -1 ||
       userAgent.indexOf("compatible") > -1 &&
       userAgent.indexOf("MSIE") > -1 ) { return 'IE浏览器' }
```
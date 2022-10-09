## 和 Object 的区别
Object  
* key只能是 string 或者 symbol，不能是对象或者正则表达式；
* 无法在O(1)内知道键的数量；
* 键值对的加入、删除没有得到优化；
* 自定义的键名容易和原型链上的键名发生冲突，比如 “constructor”；
  
Map  
* key可以是任意数据类型；
* 在O(1)内得到键值对数量；
* 适合频繁地插入、删除键值对情形；
* 可以forEach、filter等迭代；
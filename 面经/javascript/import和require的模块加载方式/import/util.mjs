// 当这个模块第一次被import的时候，会打印出 "hello"
console.log("hello");

// 被export的数据，无论你是用let声明
// 还是 const 声明，无论你是值类型还是引用类型的数据，
// node模块加载器都会当作只读属性处理；
// 为什么要作为只读属性处理呢？因为不是按照值拷贝的。
// 如果是按照值拷贝，引入方自然可以重新修改数据。也就是说，
// 这里是按照引用走起的，多个引入方共享一个 value 的引用，
// 如果一方做出修改，另一方的value取值就会陷入到矛盾。
export const value = 10;

// data 被export出去了，但不能直接给data
// 重新赋值，你只能给 data 里边的属性重新赋值
export const data = {
        msg: "hello"  
}
/**
 * 之前尝试编写了一些代码，但对响应式的理解发生错误了，
 * 响应式是指当js中的量发生改变时，它所依赖的 dom 发生改变，
 * 而我之前的理解是 js 中的量发生变化，另一js的量也发生了变化。
 * 
 * Object.defineProperty有一个内容实现起来有些困难，
 * 
 * const a = {}
 * Object.defineProperty(a, 'name', {
 *                configurable: true,
 *                enumerable: true,
 *                set(value) {
 *                    a.__name = value
 *                },
 *                get() {
 *                    return a.__name
 *                }
 * })
 * 
 * const b = {}
 * Object.defineProperty(b, 'name', {
 *                configurable: true,
 *                enumerable: true,
 *                set(value) {
 *                    b.__name = value
 *                },
 *                get() {
 *                    return b.__name
 *                }
 * })
 * 
 * b.name = 'Jack'
 * 你无法区分在 a.name 的 set方法的 value， 是字面量值，还是触发了 b.name 的 get方法得到的。
 * a.name = 'Jack'
 * a.name = b.name
 * 
 * 
 * 后续，需要研究研究vue的代码，再做打算
 */

let a = { }

function defineProperty(obj, key, value) {
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        set(_value) {
            value = _value          // 利用闭包，缓存value，就不需要自己单独设置一个变量存储_value了
        },
        get() {
            return value
        }
    })
}

defineProperty(a, 'name', 'jack')

console.log(a.name)

a.name = "Bob"

console.log(a.name)

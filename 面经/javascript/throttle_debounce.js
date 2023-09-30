/**
 * 对函数做限流处理，返回处理后的包装函数
 * 
 * 当页面发生滚动的时候，会触发大量滚动事件回调函数，单次回调函数如果
 * 比较费时，页面就会出现卡顿。这种问题在于，在有限的时间内，函数执行
 * 太多次了。限流的作用就是约束有限时间内函数执行的次数。
 * 
 * 在规定的时间内，返回的包装函数如果触发多次，则只有一次执行生效。
 * 
 * @param {Function} fn 需要被限流处理的函数
 * @param {number} time 时间阈值(ms)。在时间阈值内触发多次包装函数，仅有一次生效
 */
const throttle = (fn, time) => {
    let start = null;

    // 时间阈值末尾触发函数（也可改写为时间阈值一开始触发函数）
    return () => {
        const now = new Date().valueOf();
        if (start === null) {
            start = now;
        }

        if (now - start > time) {
            fn();
            start = now;
        }
    }
}


/**
 * 对函数做防抖处理，返回处理后的包装函数
 * 
 * 当用户往输入框中，写入文字时，如果不使用防抖函数，每次输入一个文字，
 * 就会触发一次事件回调，但实际上并不需要如此执行，只需要当用户输入文字
 * 后停顿一部分时间没有再输入时，触发一次事件回调即可。而防抖函数的功能
 * 就在于此。
 * 
 * 只要时间未到，再次触发返回的包装函数时，时间就要重新计算。
 * 
 * @param {Function} fn 需要被防抖处理的函数
 * @param {number} time 时间阈值(ms)。在时间阈值内再次触发包装函数，则时间重新计算
 */
const debounce = (fn, time) => {
    let timer = -1;

    return () => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            fn();
            timer = -1;
        }, time)
    }
}
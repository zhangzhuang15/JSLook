// NOTE: 数组的一些工具函数


// 数组去重
const getUnique = (array) => [...new Set(array)]

// 数组乱序
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5)

// 数组平均值
const getAverageOfArray = (array) => array.reduce((state, next) => state+next, 0)/array.length

// 数组众数（出现次数大于 Math.floor(array.length/2) 的元素）
const getMajorityElementOfArray = (array) => {
    const elements = array.map(item => item).sort();
    const middle = Math.floor(array.length/2);
    return elements[middle];

    // 其他算法有：哈希法，分治法，Boyer-Moore算法
};


type Middleware = (context: any, next?: Function) => any;

/**
 * 将若干中间件函数，合并成为一个中间件函数，并返回。
 * 
 * 当返回的中间件函数被调用的时候，就会按照中间件函数数组的顺序，依次执行。
 * 在执行完最后一个中间件函数后，可选地执行 next 方法收尾。
 * 
 * 每一个中间件函数最多只能调用一次next方法，当一个中间件函数没有调用next
 * 方法时，排在它后边的中间件函数都不会调用。每个中间件函数会处理同一个context
 * 数据。不会存在串联关系：下一个中间件函数处理的context数据，是上一个中间件
 * 函数的返回值
 * 
 * 代码实现来自于 `@koa/compose` npm package, 感谢`@koa`的工作！
 * 
 * @example 
 * ```ts 
 * const middlewares = [
 *   (context, next) => { console.log("hello"); next(); console.log("haha"); },
 *   (context, next) => { console.log("world"); next(); }
 * ];
 * 
 * const fn = compose(middlewares);
 * const context = {};
 * fn(context, () => { console.log("ok");});
 * 
 * // output:
 * // hello
 * // world
 * // ok
 * // haha
 * ```
 * ```ts
 * const middlewares = [
 *   (context, next) => { console.log("hello"); },
 *   (context, next) => { console.log("world"); next(); }
 * ];
 * 
 * const fn = compose(middlewares);
 * const context = {};
 * fn(context, () => { console.log("ok");});
 * 
 * // output:
 * // hello
 * ```
 * 
 * @param middlewares 中间件函数数组
 */
const composeMiddlewares = (middlewares: Middleware[]): Middleware => {
    return function(context: any, next?: Function ) {
        // traverse middlewares
        let index = -1;
        return dispatch(0);

        function dispatch(i: number) {
            if (index >= i) return Promise.reject("call next many times");

            index = i;

            let middleware: Middleware | Function | undefined = middlewares[i];

            // after call the final middleware, we should call
            // next, which a function to complete the data workflow
            if (i === middlewares.length) middleware = next;

            if (!middleware) return Promise.resolve();

            try {
                return middleware(context, dispatch.bind(null, i + 1));
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
};

/**
 * 将多个函数组合为一个函数，并返回。
 * 
 * 函数执行的时候，会先执行fns最后一个函数，然后执行fns倒数第二个函数...最后执行fns的第一个函数。
 * 在这个过程中，上一个函数的执行结果，将成为下一个函数的入参函数
 * 
 * @example 
 * ```ts 
 * const fn1 = (...args) => args.join('/');
 * const fn2 = (s) => s.length;
 * const fn3 = (n) => n;
 * 
 * const fn = compose(fn3, fn2, fn1);
 * const result = fn("usr", "bin", "zsh");
 * 
 * // result: 11
 * ```
 * @param fns 函数数组
 */
const compose = (...fns: Function[]): Function => {
    if (fns.length === 0) return (...arg) => arg;

    return fns.reduce((fn, fnNext) => {
        return (...arg) => {
            fn(fnNext(...arg));
        };
    });
};
const ThenableFlag = Symbol('then');
const TerminateFlag = Symbol('terminate');
const isNotUndefinedOrNull = (v: any) => v !== undefined && v !== null;
const isIterable = (value: any) => {
    return value !== undefined && value !== null && typeof value[Symbol.iterator] === 'function';
}

interface Function {
    (...args: any[]): any;
    [ThenableFlag]?: boolean;
    [TerminateFlag]?: boolean;

}

/**
 * 限制函数执行的次数，做多只能执行value次
 * @param value 次数
 * @returns 
 */
export function take(value: number) {
    let v = value;

    return function(fn: Function) {
        return function(...args: any[]) {
            if (v > 0) {
                v -= 1
                return fn(...args);
            }
        }
    }
}

/**
 * 转化函数入参数，mapFn返回的结果，将作为函数实际入参
 * @param mapFn 
 * @returns 
 */
export function mapArgs(mapFn: (v: any) => any) {
    return function(fn: Function) {
        return function(...args: any[]) {
            return fn(...args.map(mapFn))
        }
    }
}

/**
 * 将函数的返回值映射为另一个值
 * @param mapFn 
 * @returns 
 */
export function mapReturn(mapFn: (v: any) => any) {
    return function(fn: Function) {
        return function(...args: any[]) {
            return mapFn(fn(...args))
        }
    }
}

/**
 * 验证函数每一个入参，当有一个入参验证不通过，则该函数不会执行
 * @param validate 
 * @returns 
 */
export function validateArgs(validate: (v: any, index: number) => boolean) {
    return function(fn: Function) {
        return function(...args: any[]) {
            let pass = true
            for (const [index, arg] of args.entries()) {
                if (!validate(arg, index)) {
                    pass = false
                    break
                }
            }
            if (pass) {
                return fn(...args)
            }
        }
    }
} 

/**
 * 验证函数结果，如果结果验证不通过，立即将返回结果作为一个错误抛出
 * @param validate 
 * @returns 
 */
export function validateReturnValue(validate: (v: any) => boolean) {
    return function(fn: Function) {
        return function(...args: any[]) {
            const result = fn(...args);
            if (!validate(result)) {
                throw result
            }
            return result
        }
    }

}

/**
 * 将若干个函数串联起来形成一个新的函数，上一个函数的返回值是下一个函数的入参。
 * 
 * 被串联的函数返回值可能有promise，因此整个函数返回值可能是个promise
 * @param fns 
 * @throws
 * @returns 
 */
export function pipe(...fns: Function[]) {
    const thenableFn = (
        fn: Function, 
        currentIndex: number, 
        currentState: any[] | Promise<any>,
        asyncNextFnIndex: { current: number }
    ) => {
        if (currentState instanceof Promise) {
            return {
                result: 
                  currentState
                    .then((value) => {
                        if (asyncNextFnIndex.current === -1) {
                            return fn('success')(value);
                        }

                        if (asyncNextFnIndex.current === currentIndex) {
                            asyncNextFnIndex.current += 1;
                            return fn('success')(value);
                        }

                        return value;
                    }, (err) => {
                        if (asyncNextFnIndex.current === -1) {
                            return fn('fail')(err);
                        }

                        if (asyncNextFnIndex.current === currentIndex) {
                            asyncNextFnIndex.current += 1;
                            return fn('fail')(err);
                        }

                        return err;
                    }),
                next: currentIndex + 1,
            }
        }

        return {
            result: fn('success')(...currentState),
            next: currentIndex + 1,
        }
    };

    const terminateFn = (
        fn: Function, 
        currentIndex: number, 
        currentState: any[] | Promise<any>, 
        tailIndex: number, 
        asyncNextFnIndex: { current: number }
    ) => {
        if (currentState instanceof Promise) {
            return {
                result: currentState.then((value) => {
                    const val = fn(value);
                    if (val === true) {
                        asyncNextFnIndex.current = currentIndex + 1;
                    }

                    if (val === false) {
                        asyncNextFnIndex.current = tailIndex + 1;
                    }

                    if (typeof val === 'number') {
                        asyncNextFnIndex.current = val;
                    }
                    return value;
                }),
                next: currentIndex + 1,
            }
        }

        const val = fn(...currentState);
        // 意味着通过，后续的函数可以继续执行
        if (val === true) {
            return {
                result: currentState,
                next: currentIndex + 1,
            }
        }

        // 也意味着通过，但是要从index=val的函数开始继续执行
        if (typeof val === 'number') {
            return {
                result: currentState,
                next: val,
            }
        }

        // 意味着不通过，后边的函数都不执行
        if (val === false) {
            return {
                result: currentState,
                next: tailIndex + 1,
            }
        }

        return {
            result: currentState,
            next: currentIndex + 1,
        }
    
    };

    const simpleFn = (fn: Function, currentIndex: number, currentState: any[] | Promise<any>, asyncNextFnIndex: { current: number }) => {
        if (currentState instanceof Promise) {
            return {
                result: currentState.then((value) => {
                    if (asyncNextFnIndex.current === -1) {
                        return fn(value);
                    }

                    if (asyncNextFnIndex.current === currentIndex) {
                        asyncNextFnIndex.current += 1;
                        return fn(value);
                    }

                    return value;
                }),
                next: currentIndex + 1,
            }
        }

        return {
            result: fn(...currentState),
            next: currentIndex + 1,
        }
    };

    const entry = (
        fn: Function, 
        currentIndex: number, 
        currentState: any[], 
        tailIndex: number,
        asyncNextFnIndex: { current: number }
    ) => {
        if (fn[ThenableFlag] as boolean) {
            return thenableFn(fn, currentIndex, currentState, asyncNextFnIndex);
        }

        if (fn[TerminateFlag]) {
            return terminateFn(fn, currentIndex, currentState, tailIndex, asyncNextFnIndex);
        }

        return simpleFn(fn, currentIndex, currentState, asyncNextFnIndex)

    };

    const resolveParam = (arg: any) => {
        if (arg instanceof Promise) {
            return arg;
        }

        return isIterable(arg) ? arg : [arg]
    }

    return function(...args: any[]) {
        let i = 0
        let result: any = args
        const asyncNextFnIndex = { current: -1 }

        for (;i < fns.length;) {
            const fn = fns[i];
            const resolvedValue = resolveParam(result);
            const { result: nextState, next: nextIndex } = entry(fn, i, resolvedValue, fns.length - 1, asyncNextFnIndex);
            i = nextIndex;
            result = nextState;
        }

        return result;
    }
}

export function thenify(success: Function, fail: Function) {
    const fn = (flag: 'success' | 'fail') => {
        switch (flag) {
            case 'fail':
                return fail;
            case 'success':
                return success;
            default:
                throw Error('flag must be "success" or "fail" ')
        }
    }

    fn[ThenableFlag] = true;
    return fn;
}

/**
 * fn函数在 pipe 函数中的结果为 true, pipe 函数流继续执行，
 * 否则，pipe 函数流执行立即结束
 * @param fn 
 * @returns 
 */
export function terminate(fn: Function) {
    fn[TerminateFlag] = true;
    return fn;
}

/**
 * 遵循蛋壳模型，将若干个函数对一个函数的效果，复合成一个函数对该函数的效果，
 * 最终返回的依旧是一个高级函数，函数入参是另一个函数
 * 
 * @param fns 
 * @returns 
 */
export function composite(...fns: Function[]) {
    return function(fn: Function) {
        let f = fn;

        for (let i = fns.length - 1; i > -1; i--) {
            f = fns[i](f);
        }

        return f;
    }
}
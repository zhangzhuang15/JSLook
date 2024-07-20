const ThenableFnFlag = Symbol('then');
const isNotUndefinedOrNull = (v: any) => v !== undefined && v !== null;
const isIterable = (value: any) => {
    return value !== undefined && value !== null && typeof value[Symbol.iterator] === 'function';
}

interface Function {
    (...args: any[]): any;
    [ThenableFnFlag]?: boolean;
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
        asyncNextFnIndex: { current: number }
    ) => {
        if (fn[ThenableFnFlag] as boolean) {
            return thenableFn(fn, currentIndex, currentState, asyncNextFnIndex);
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
            const { result: nextState, next: nextIndex } = entry(fn, i, resolvedValue, asyncNextFnIndex);
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

    fn[ThenableFnFlag] = true;
    return fn;
}

export function takeEffect(effect: Function) {
    return (param: any) => {
        effect();
        return param;
    }
}

export function takeEffectWithParams(effect: Function) {
    return (param: any) => {
        effect(param);
        return param;
    }
}
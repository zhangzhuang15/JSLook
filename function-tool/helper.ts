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
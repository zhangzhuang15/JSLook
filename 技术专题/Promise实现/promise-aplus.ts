/**
 * 根据promise A+文档给出的实现
 * 
 * refer: https://promisesaplus.com
 */

const isPromise = (obj: any) => {

}

const isThenable = (value: any) => {
    if (typeof value === "object" || typeof value === "function") {
        if (typeof value.then === "function") {
            return true
        }
    }

    return false
}

const enum PromiseState {
    Pending,
    Fulfilled,
    Rejected
}

/**
 * 将fn加入调度器
 * 
 * 标准中的Promise和Promise具体实现，它们之间最大的差异就在于调度策略，
 * 这个策略关系到，什么时机执行 {@link MyPromise.then | then} 中的
 * onFulfilled 和 onRejected 任务
 * 
 * @param fn 
 */
const schedule = (fn: Function) => {
    fn()
}

const resolvePromise = (promise: MyPromise, x: any) => {
    if (promise === x) {
        rejectPromise(promise, TypeError("wrong"))
        return
    }

    if (promise.state !== PromiseState.Pending) {
        return
    }

    if (x instanceof MyPromise) {
        switch (x.state) {
            case PromiseState.Fulfilled:
                promise.state = PromiseState.Fulfilled
                promise.value = x.value
                schedule(promise.onStateChange.bind(promise))
                break 
            case PromiseState.Rejected:
                promise.state = PromiseState.Rejected
                promise.reason = x.reason
                schedule(promise.onStateChange.bind(promise))
                break 
            default:
                promise.state = PromiseState.Pending
                x.addFollower(promise)
        }
        return
    }

    if (typeof x === "object" || typeof x === "function") {
        try {
            const then: Function | undefined = x.then
            if (then) {
                // node运行时中， resolvePromise 不会立即执行，会放到一个微任务里执行
                then.call(x, resolvePromise.bind(null, promise), rejectPromise.bind(null, promise))
            } else {
                promise.state = PromiseState.Fulfilled
                promise.value = x
                schedule(promise.onStateChange.bind(promise))
            }
        } catch (err) {
            if (promise.state === PromiseState.Pending) {
                rejectPromise(promise, err)
            }
        }

        return 
    } 

    promise.state = PromiseState.Fulfilled
    promise.value = x
    schedule(promise.onStateChange.bind(promise))

}

const rejectPromise = (promise: MyPromise, reason: any) => {
    promise.state = PromiseState.Rejected
    promise.reason = reason
    promise.onStateChange()
}



type ResolveFn = (value: any) => any;
type RejectFn = (reason: any) => any;

interface Follower {
    promise: MyPromise
    onFulfilled: (v: any) => any 
    onRejected: (reason: any) => any
}

class MyPromise {
    state: PromiseState
    value?: any
    reason?: any
    followers: Follower[]

    constructor (initialFn?: (resolve: ResolveFn, reject?: RejectFn) => any) {
        this.state = PromiseState.Pending
        this.followers = []

        if (initialFn) {
            const resolve: ResolveFn = (v) => {
                resolvePromise(this, v)
            }

            const reject: RejectFn = (e) => {
                rejectPromise(this, e)
            }

            initialFn(resolve, reject)
        }
    }

    addFollower(promise: MyPromise, onFulfilled:  ResolveFn = (v) => v, onRejected: RejectFn = (reason) => reason) {
        this.followers.push({
            promise,
            onFulfilled,
            onRejected
        })

    }

    then(onFulfilled: ResolveFn = (v) => v, onRejected: RejectFn = (reason) => reason) {
        const promise = new MyPromise()
        if (this.state === PromiseState.Fulfilled) {
            const fn = () => {
                try {
                    const v = onFulfilled(this.value)
                    resolvePromise(promise, v)
                } catch (err) {
                    rejectPromise(promise, err)
                }
            }

            schedule(fn)
        } else if (this.state === PromiseState.Rejected) {
            const fn = () => {
                try {
                    const v = onRejected(this.reason)
                    resolvePromise(promise, v)
                } catch (err) {
                    rejectPromise(promise, err)
                }
            }

            schedule(fn)
        } else {
            this.followers.push({promise, onFulfilled, onRejected})
        }

        return promise
    }

    onStateChange() {
        for (const follower of this.followers) {
            if (this.state === PromiseState.Fulfilled) {
                const { promise, onFulfilled } = follower

                const fn = () => {
                    try {
                        const v = onFulfilled(this.value)
                        resolvePromise(promise, v)
                    } catch (err) {
                        rejectPromise(promise, err)
                    }
                    
                }

                // 可能经过调度器处理， 并非直接执行
                schedule(fn)
            } else if (this.state === PromiseState.Rejected) {
                const { promise, onRejected } = follower 

                const fn = () => {
                    try {
                        const v = onRejected(this.reason)
                        resolvePromise(promise, v)
                    } catch (err) {
                        rejectPromise(promise, err)
                    }
                }
 
                // 可能经过调度器处理， 并非直接执行
                schedule(fn)
            }
        }

        this.followers = []
    }


}


function test() {
    const p = new MyPromise((resolve, reject) => {
        setTimeout(() => resolve(10), 1000)
    })

    new MyPromise(resolve => {
        resolve(p)
    }).then(v => console.log(v))
}

test()


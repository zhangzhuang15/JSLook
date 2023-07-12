const Subscriber = require('./Subscriber')

// 可观察对象 ｜ 被观察者 ｜ 事件源
class Observable {
    /**
     * @param {(observer: Subscriber) => any} driveObserverDoFn 事件发生时，驱动观察者做一些事情
     */
    constructor(driveObserverDoFn) {
        this._driveObserverDo = driveObserverDoFn
    }
    
    /**
     * 将自身注册到观察者
     * @param {{ next: (value: any) => any; error: (value: any) => void; complete: (value: any) => void }} observer 观察者
     * @returns 
     */
    subscribe(observer) {
        const subscriber = new Subscriber(observer)
        const unSubscribeFnOrObj = this._driveObserverDo(subscriber)
        subscriber.add(unSubscribeFnOrObj)
        return subscriber
    }

    
    pipe(...operations) {
        return this._pipFromArray(operations)(this)
    }

    _pipFromArray(operations) {
        if (operations.length === 0) {
            return (observable) => observable
        }
        return (observable) => {
            return operations.reduce((state, fn) => fn(state), observable)
        }
    }
}

function map(fn) {
    return (observable) => new Observable((observer) => {
        const subscriber = observable.subscribe({
            next: value => {
                return observer.next(fn(value))
            },
            error: value => {
                observer.error(value)
            },
            complete: value => {
                observer.complete(value)
            }
        })
        return subscriber
    })
}


module.exports = {
    Observable,
    map
}
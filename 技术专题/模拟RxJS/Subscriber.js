class Subscriber {
    constructor(observer) {
        this._observer = observer
        this._isStopped = false
        this._unSubscribeFns = []
    }

    add(unSubscribeFn) {
        this._unSubscribeFns.push(unSubscribeFn)
    }

    next(value) {
        if (!this._isStopped) {
            this._observer && this._observer.next(value)
            this._isStopped = true
        }
    }

    error(value) {
        if (!this._isStopped) {
            this._observer && this._observer.error(value)
            this._isStopped = true
        }
    }

    complete(value) {
        this._isStopped = true
        this._observer && this._observer.complete(value)
        this.unSubscribe()
    }

    unSubscribe() {
        this._unSubscribeFns.forEach(fn => {
            if (typeof fn === "function") {
                fn()
            } else if (fn instanceof Subscriber) {
                fn.unSubscribe()
            } 
        })
    }
}

module.exports = Subscriber
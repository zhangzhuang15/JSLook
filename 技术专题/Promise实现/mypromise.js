/**
 *  手撕实现 Promise
 */


class MyPromise {
    status = "Pending";
    value = undefined;
    reason = undefined;
    onFulfilledFn = [];
    onRejectedFn = [];

    constructor(fn){

        let reject = reason => {
            if(reason instanceof MyPromise) {
                reason.then( data => {}, err => { this.reason = err;})
            } else {
                this.reason = reason;
            }
            // 使用 this.reason的拷贝执行 reject 回调函数，
            // 不要破坏 this.reason 本身！
            let __reason = this.reason;
            this.onRejectedFn.forEach( fn => { fn(__reason);});
            this.onRejectedFn = [];
            this.status = "Rejected";
        };

        let resolve = value => {
            if( value instanceof MyPromise){
                value.then(data => { this.value = data;})
            }else{
                this.value = value;
            }
            let __value = this.value;
            this.onFulfilledFn.forEach(
                fn => { 
                    try { 
                        // 这里不需要 __value = fn(__value);
                        // 因为调用 then 方法注册回调函数后，回调函数
                        // 的返回值 属于 then方法返回的新的Promise对象；
                        // fn(__value) 本身会触发 resolve方法，将值交给新的Promise对象；
                        fn(__value);
                    } catch(e) {
                        reject(e);
                    }
                });
            this.onFulfilledFn = [];
            this.status = "Fulfilled";
        };

        // fn 是调用者定义的 (resolve, reject) => {} 函数，
        // 调用者不知道 resolve, reject 的实现细节，由我们给出；
        // 相当于 调用者给出了一个架子，我们把具体值带入即可。
        try {
            fn(resolve, reject);
        } catch(e) {
            reject(e);
        }
    }


    then(onFulfilled, onRejected){
        if(onFulfilled == null || typeof onFulfilled != "function") 
           return this;

        if(this.status == "Fulfilled"){
            let value;
            try {
                value = onFulfilled(this.value) || undefined;
            } catch(e) {
                return new MyPromise((resolve, reject) => { reject(e)});
            }
            // then 返回的是一个新的 Promise
           return new MyPromise((resolve, reject) => { resolve(value);});
        }

        if(this.status == "Rejected"){
           let reason;
           try{
               reason = onRejected(this.reason) || undefined;
           } catch(e) {
               return new MyPromise((resolve, reject) => { reject(e);});
           }
           return new MyPromise((resolve, reject) => { reject(reason)});
        }

        if(this.status == "Pending"){
            let _this = this;
            // 当 Promise 的状态没有达到终止状态（Fullfilled 或者 Rejected）时，
            // 应该把 onFulfilled 和 onRejected 函数注册起来，并返回一个新的Promise
            // 对象，当 Promise 状态完结时，触发新的Promise状态完结。这当然要依赖Promise
            // 的回调函数队列实现了，因此是把 onFulfilled 和 onRejected 函数注册到Promise
            // 中，而不是注册到新的Promise中。
            let p = new MyPromise((resolve, reject) => {
                let _value, _reason;
                _this.onFulfilledFn.push(value => {
                    try{
                        _value = onFulfilled(value) || undefined;
                    }catch(e){
                        reject(e);
                    }
                    resolve(_value);
                });
                _this.onRejectedFn.push( reason => {
                    try{
                        _reason = onRejected(reason) || undefined;
                    }catch(e){
                        reject(e);
                    }
                    reject(_reason);
                });
            });
            return p;
        }
    }


    static all(promises) {
        if(promises instanceof Array) {
            let result = [];
            let size = promises.length;
            // 记录已经产生了多少个结果
            let consequenceSize = 0;
            
            return new MyPromise( (resolve, reject) => {

                promises.forEach( (promise, index) => {
                    let _promise = promise;
                    if(!(promise instanceof MyPromise)) {
                        _promise = new MyPromise(_resolve => { _resolve(promise)});
                    } 
                    // 当 result中得到 size 个结果后，才能通过resolve返回；
                    // 因此 resolve 应该放在异步函数 data => {} 中。
                    _promise.then(
                        data => {
                            result[index] = data;
                            // 回调函数执行，到这里data已经是确切的数据啦，
                            // consequenceSize要增1.
                            consequenceSize += 1;
                            if( consequenceSize === size) {
                                resolve(result);
                            }
                        },
                        // promise中有一个出问题啦，那么就用 reject 直接返回
                        err => {
                            reject(err)
                        }
                    );
                });
            });
        } else {
            return MyPromise(
                (resolve, reject) => {
                    if(promises instanceof MyPromise) {
                        promises.then(data => resolve(data), err => reject(err));
                    } else if(promises instanceof Error){
                        reject(promises);
                    } else {
                        resolve(promises);
                    }
                }
            );
        }
    }
}





module.exports = MyPromise;
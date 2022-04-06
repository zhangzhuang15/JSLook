// 可观察对象， 即 被观察者
class Observable{
    constructor(actionFunc){
        if(typeof actionFunc === "function"){
            if(actionFunc.length != 1){
                throw Error("Observable just accept one param");
            }
            this.action = actionFunc;
            this.completePromise = new Promise(
                ( resolve , reject) => { 
                    this.completeResolve = resolve;
                    this.completeReject = reject;
                }
            );
        }
    }
    
    // 注册 观察者
    subscribe(obj){
        const that = this;
        const args = arguments;
        let params = { next: null,
                       complete: null,
                       error: null
                    };
        params.complete = function() {
            that.completeResolve();
        }
        params.error = function() {};
        switch(args.length){
            case 1:
                if(typeof obj === "function"){
                    params.next = obj;
                }
                if(typeof obj === "object"){
                    params.next = function() {
                        try {
                            obj.next(...arguments);
                        } catch(err) {
                            that.completeReject(err);
                        }
                    }
                    params.error = function() {
                        try {
                            obj.error(...arguments);
                            that.completeReject(arguments);
                        } catch(err) {
                            that.completeReject(err);
                        }
                    }
                    params.complete = function() {
                        try {
                            const result = obj.complete(...arguments) || undefined;
                            that.completeResolve(result);
                        } catch(err) {
                            that.completeReject(err);
                        }
                    }                          
                }
                break;
            case 2,3:
                args.forEach(arg => {
                    if(arg.constructor !== "[Function: Function]"){
                        throw Error("subscribe params Invalid!");
                    }
                });
                params.next = function() {
                    try {
                        args[0](...arguments);
                    } catch(err) {
                        that.completeReject(err);
                    }
                }
                params.error = function() {
                    try {
                        args[1](...arguments);
                    } catch(err) {
                        that.completeReject(err);
                    }
                }
                params.complete = function() {
                    try {
                        const result = args[2](...arguments) || undefined;
                        that.completeResolve(result);
                    } catch(err) {
                        that.completeReject(err);
                    }
                }
                break;
            default:
                throw Error("subscribe params invalid!")
        }
        this.action(params);
        return this;
    }

    toPromise() {
        const that = this;
        return new Promise(
            (resolve, reject) => { 
                that.completePromise
                    .then( data => resolve(data) )
                    .catch( reason => reject(reason) )
            }
        );
    }
}


var o = new Observable(
    // 先注册 观察者要开展的行动
    subscriber => {
        console.log("M");
        subscriber.next("jack");
        subscriber.complete("jucie");
        return "ok";
    }
);


// 传入一个观察者，让观察者开始行动
o.subscribe(
    {
        next: function(i){
            console.log("hello", i);
        },
        error: () => {},
        complete: function(i){ 
            console.log("I don't like ", i); 
            return i;
        }
    }
).toPromise()
 .then( data => console.log("data: ", data) );



 // 借鉴 RxJs 以及 AngularJs
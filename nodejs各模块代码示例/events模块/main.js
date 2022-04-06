const Emitter = require("events");

class MyEmitter extends Emitter{}

const myEmitter = new MyEmitter();

var listener_C = () => { 
                            console.log("C");
                       };
/** 1 */
/** 调用on方法加入事件响应函数时，默认会先响应newListener事件，
 *  也就是说，在调用on方法时，就会触发newListener事件。
 *  这将导致 打印C 的函数会排在最前边。
 *  如果把 1 排在 3的后边，就不会这样。
 */
myEmitter.once("newListener", (eventName, listener) => {
    if(eventName === "open"){
        myEmitter.on("open", listener_C)
    }
});



/** 2 */
/** 第一个参数被称为事件名，第二个参数是一个函数，被称为监听器 */
myEmitter.on("open", () => { console.log("A");});



/** 3 */
myEmitter.on("open", () => { console.log("B");});

/** 相同事件，多次绑定响应函数，响应函数会加入到一个队列中，
 *  事件被触发的时候，从队头依次执行到队尾
 */


console.log("maximum number of listeners : ", myEmitter.getMaxListeners());
console.log("listeners of 'open' event : ", myEmitter.listenerCount("open"));
console.log("listener list of 'open' event : ", myEmitter.listeners('open'));

myEmitter.prependListener("open", () => { console.log('D');});


console.log("1 ------- open");
myEmitter.emit("open");

/** 没有效果, 必须是对同一个函数的引用才行 */
myEmitter.removeListener("open", () => {
    console.log("C");
});

myEmitter.removeListener("open", listener_C);

console.log("2 ------- open");
myEmitter.emit("open");
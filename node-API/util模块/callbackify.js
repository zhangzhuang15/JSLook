/** 异步函数包装为回调函数 */
const util = require("util");


async function say_hello() {
    return "hello";
}

async function say_world() {
    return new Promise(
        resolve => { 
            setTimeout( () => { resolve("world") }, 3000)
        }
    );
}


async function say_err() {
    return new Promise(
        (_, reject) => {
            setTimeout( () => { reject("Error") }, 5000);
        }
    );
}

var sayHello = util.callbackify(say_hello);
var sayWorld = util.callbackify(say_world);
var sayErr = util.callbackify(say_err);


sayHello(null, 
         (err, result) => { 
             if(!err) console.log("say: ", result);
          }
);


sayWorld(null,
         (err, result) => {
             if(!err) console.log("say: ", result);
         }
);


sayErr(null, 
       (err, result) => {
           if(!err) console.log("say: ", result);
           else console.log("err: ", err);
       }
);
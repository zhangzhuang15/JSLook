/** 回调函数封装成返回Promise的函数 */
const util = require("util")

function getMessage(email, callback) {
    setTimeout(
        () => {
            callback(null, email.message); // 注意 callback的类型 (err: Error, result: any) => void
        }
        , 4000
    );
}


const email = { 
    date: Date.now().toLocaleString(),
    message: "you passed final exam"
}


const getMessagePromise = util.promisify(getMessage);

getMessagePromise(email).then( data => { console.log("message: ", data)})
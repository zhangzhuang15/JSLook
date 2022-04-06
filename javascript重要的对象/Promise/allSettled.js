// 无论 Promise 是 resolved 还是 rejected， 一律封装成 Array<{ status: string, value: any} | { status: string, reason: any}> 返回
Promise.allSettled([Promise.resolve("hello world"), Promise.reject("Bad input")])
       .then( data => console.log("data: ", data));
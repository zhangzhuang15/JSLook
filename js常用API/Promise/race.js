// 只要有一个Promise resolved 或者 rejected， 整体就变为 resolved 或者 rejected
Promise.race([Promise.reject("Bad input"), Promise.resolve("hello world")])
       .then( data => console.log("speak: ", data) )
       .catch( reason => console.log("err: ", reason) );


Promise.race([Promise.resolve("hello world"), Promise.reject("Bad input")])
       .then( data => console.log("data: ", data) )
       .catch( reason => console.log("reason: ", reason) ); 
// 只要有一个 resolve，那么整体就resolve
Promise.any([Promise.reject("Bad input"), Promise.reject("out of range"), Promise.resolve("hello world"), Promise.resolve("Wow")])
       .then( data => console.log(data) );

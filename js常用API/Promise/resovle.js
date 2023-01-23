
var promise1 = Promise.resolve(100);

                                      // 没有返回任何值
var promise2 = promise1.then( data => console.log("I get score: ", data) );
                                      // 返回 98
var promise3 = promise1.then( data => 98 );

                                      // undefined
promise2.then( data => console.log("promise2 data: ", data) );
                                      // 98
promise3.then( data => console.log("promise3 data: ", data) );




// 更骚气的操作

var start;
new Promise( resolve => start = resolve)
    // 先预设 后续操作，什么时候开始执行操作由 start控制
    .then( data => {
        console.log("data: ", data);
    });

setTimeout(
    () => {
        start( { name: "Jean", socre: 66 } );
    }
    , 4000
);
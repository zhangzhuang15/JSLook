// 有一个Promise reject，整体就reject
Promise.all([Promise.resolve("hello"), Promise.resolve("world"), Promise.reject("Bad")])
       .then( data => console.log("resolved: ", data) )
       .catch( err => console.error("rejected: ", err) )
       .finally( () => console.log("finished!") );       // resolved 或者 rejected，finally都会执行


// 全部Promise resolve， 才算resolve
Promise.all([Promise.resolve("hello"), Promise.resolve("world")])
       .then( data => console.log("resolved: ", data) )
       .finally( () => console.log("finished again!") );
const MyPromise = require("./mypromise");

let m = new MyPromise(
    resolve => {
        setTimeout(() => { resolve(4) }, 3000);
    }
);

m.then(data => { 
    console.log("data 1: ", data);
    return data+1
})
.then(data => { 
    console.log('data 2: ', data)
});

m.then(data => { 
    console.log("data 3: ", data);
    return data+2
})
.then(data => { 
    console.log('data 4: ', data)
});


let promise_A = new MyPromise(resolve => {
    setTimeout(() => { resolve("A")}, 2000)
});

let promise_B = new MyPromise(resolve => {
    setTimeout(() => { resolve("B")}, 2000);
});

MyPromise.all([promise_A, promise_B, "C"])
         .then(result => {
             console.log("MyPromise.all([promise_A, promise_B, 'C']): ", result);
         });
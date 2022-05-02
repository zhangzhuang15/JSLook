async function hello() {
    console.log(1)
    return Promise
            .resolve(1)
            .then(_ => { 
                console.log(2); 
                return 2;
            })
}

async function say() {
    console.log(3)
    var p = await hello()
    console.log(p)
    console.log(4)
}


say()

console.log(5)

//
// var p = await hello() 等效于
//       Promise
//          .resolve(hello)
//          .then( p => {
//                     console.log(p);
//                     console.log(4);
//          })
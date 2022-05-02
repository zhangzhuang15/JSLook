async function hello() {
    console.log(1)
    await new Promise(resolve => {
        setTimeout( _ => {
            resolve(2)
            console.log(2)
        }, 0)
    })
    console.log(3)
    return 4
}

async function say() {
    console.log(4)
    await hello()
    console.log(5)
}

say()

//
// await hello() 等效于
//     Promise.resolve(hello()).then( _ => console.log(5))
// 
// hello() 等效于
//     new Promise( resolve => {
//                          console.log(1)
//                          new Promise( _resolve => {
//                                            setTimeout( _ => {
//                                                          _resolve(2)
//                                                          console.log(2)
//                                                        },
//                                             0)
//                                       }
//                          )
//                           .then(_ => {
//                                     console.log(3)
//                                     resolve(4)    
//                                 })
//                 })
async function hello() {
    console.log(1)
    return new Promise(resolve => resolve("hello"))
}

async function say() {
    console.log(2)
    const v = await hello()
    console.log(v)
}

say().then(() => console.log(3))
Promise.resolve().then(() => console.log(4)).then(() => console.log(5))


// await hello() 等效于:
// Promise.resolve().then(() => { console.log(1); return new Promise(resolve => resolve("hello"))}).then(v => v)
//
// 进一步，say 等效于：
// function say() {
//   console.log(2);
//   return Promise
//              .resolve()
//              .then(() => {
//                  console.log(1);
//                  return new Promise(resolve => resolve("hello"));
//              })
//              .then(v => v)
//              .then(v => console.log(v));
// }
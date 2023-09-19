async function hello() {
    console.log(3);
    return "hello"
}

hello().then((r) => console.log(r))
// 等效于:
// Promise.resolve((() => { console.log(3); return "hello"})()).then((r) => console.log(r));


Promise.resolve().then(() => console.log(1)).then(() => console.log(2))


// Promise.resolve 伪代码实现：
// function Promise_resolve(value) {
//     if (value instanceof Promise) {
//       return value;
//     }
//     if (value && typeof value.then === 'function') {
//       return new Promise((resolve, reject) => {
//         value.then(resolve, reject);
//       });
//     }
//     return new Promise(resolve => resolve(value));
//   }
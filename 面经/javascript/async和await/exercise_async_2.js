async function hello() {
    console.log(1)
    return {
        then: (r) => r("hello")
    }
}

hello().then((value) => console.log(value))
// 等效于：
// Promise.resolve((() => { console.log(1); return { then: (r) => r("hello") } })()).then(r => console.log(r))

Promise.resolve().then(() => console.log(2)).then(() => console.log(3))


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
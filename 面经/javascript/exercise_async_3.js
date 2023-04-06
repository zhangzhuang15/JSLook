async function hello() {
    return new Promise((resolve) => resolve("hello"))
}

hello().then((value) => console.log(value))
Promise.resolve().then(() => console.log(1)).then(() => console.log(2))

// hello() equals to Promise.resolve().then(() => new Promise((resolve) => resolve("hello")))



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
  
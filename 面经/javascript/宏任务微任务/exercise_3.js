//     1
setTimeout(() => console.log(1), 0);

// 2                                        3
setTimeout(() => Promise.resolve().then(() => console.log(2)), 0);

// 4
process.nextTick(() => console.log(3));

// 5
Promise.resolve().then(() => console.log(4));

// 6                                           7
Promise.resolve().then(() => setTimeout(() => console.log(5), 0));


// 8
console.log(6);


/**
 * this case tells you that not every task which is put into queue by `process.nextTick`,
 * will be executed before tasks created by `Promise.resolve().then`
 * 
 * task created by `process.nextTick` will be put into `next tick queue`;
 * task created by `Promise.resolve().then` will be put into `microtaskqueue`;
 * 
 * they're two different queue;
 */
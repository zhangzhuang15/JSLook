/**
 * Atomics 提供对 typedArray 的原子操作
 */

// 开辟 20 字节大小的 Buffer
const buffer = new SharedArrayBuffer(20);
// 按照 4 字节 Int 类型操作buffer
const list = new Int32Array(buffer);  

list.forEach((_, index) => {
    list[index] = index;
});

console.log("look at list: ", list);


Atomics.add(list, 0, 3); // list[0] = list[0] + 3
Atomics.and(list, 1, 3); // list[1] = list[1] & 3
Atomics.compareExchange(list, 2, 3, 4); // if list[2] = 3, then list[2] = 4  CAS operation
Atomics.exchange(list, 3, 13); // list[3] = 13
var temp = Atomics.load(list, 4); // get list[4] in safe way
console.log("after some operations:\n \
\t\tlist[0] add operation \n\
\t\tlist[1] and operation \n\
\t\tlist[2] compareExchange operation\n\
\t\tlist[3] exchange operation\n\
\t\tlist[4] load operation\n\
look at list: ", list);
console.log();

Atomics.or(list, 0, 1); // list[0] = list[0] | 1
Atomics.sub(list, 1, 1); // list[1] = list[1] - 1
Atomics.xor(list, 2, 1); // list[2] = list[2] ^ 1
temp = Atomics.store(list, 3, 12); // list[3] = 12 , return newValue

// 如果主线程没有执行完毕， setTimeout将不会执行;
// Atomics.wait如果没有指定 4000ms， 将一直阻塞主线程，等待其他线程
// 调用notify唤醒，此时setTimeout就不会执行，里面的唤醒操作就不会执行，
// 最终整个线程就一直阻塞。
setTimeout(
    () => { 
        Atomics.notify(list, 0, 1); // 唤醒阻塞在 list[0] 的 1 个线程
    }
, 2000); 

var result = Atomics.wait(list, 0, 3 , 4000); // if list[0] === 3, 阻塞 4000 ms；
                                              // 如果超时自己唤醒，返回 "timed-out";
                                              // 如果在限时内被其他线程唤醒，返回 "ok";
                                              // 除此之外，返回 "not-equal"

console.log("after some operations:\n\
\t\tlist[0] or operation \n\
\t\tlist[1] sub operaion \n\
\t\tlist[2] xor operation \n\
\t\tlist[3] store operation \n\
look at list: ", list);

console.log("result: ", result);
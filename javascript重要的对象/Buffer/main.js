/**
 *  Buffer 模块用于字节码处理
 * 
 *  JavaScript的普通数组用于存储字符，但是对于字节码，需要使用typedArray存储。
 *  Buffer 初始化时，会在底层创建一个ArrayBuffer，之后Buffer成为这个ArrayBuffer
 *  的视图对象，提供操纵ArrayBuffer的方法。
 * 
 *  在JavaScript中，ArrayBuffer和SharedArrayBuffer只能开辟出固定字节长度的空间，
 *  但是不提供任何方法实现赋值，取值操作；如果想操作这些字节空间， 必须要使用Buffer、
 *  DataView、或者 Uint8Array等对象，去操作。这相当于将空间的开辟，和空间的利用解耦。
 * 
 *  由Buffer类创建的buffer对象，可以直接使用buffer[i] = m 的方式操作底层字节数据；
 *  由ArrayBuffer和SharedArrayBuffer创建的对象buffer，要想操作底层数据，必须通过
 *  new Uinit8Array(buffer)这样的方式创建一个typedArray对象，之后该对象就可以按
 *  索引号处理底层字节数据。
 * 
 *  ArrayBuffer SharedArrayBuffer不具备 from等方法；
 *  Uint8Array等typedArray具备 from等方法
 * 
 *  from方法中的参数应是 可迭代对象或者类数组对象(拥有length属性或者 0，1，2这样的键名)
 * 
 */

var buffer1 = Buffer.from([1, 2, 3]);
var buffer2 = Buffer.of(1, 2, 4, 5);
console.log("buffer1: ", buffer1);
console.log("buffer2: ", buffer2);

var buffer3 = Buffer.alloc(5, 1);
var flag = Buffer.compare(buffer1, buffer2);
console.log("buffer3: ", buffer3);
// flag :  1 大于  0 等于 -1 小于
console.log("buffer1 > buffer2 ? ", flag);
var buffer4 = Buffer.concat([buffer1, buffer2]);
console.log("buffer4: ", buffer4);

buffer4.fill('a', 4, 6);
console.log("after fill, buffer4: ", buffer4);

var index = buffer4.findIndex(item => item == 3);
console.log("index of value 3 in buffer4: ", index);

console.log('buffer4 has "a" ? ', buffer4.includes('a'));

var s = buffer4.join('~');
console.log("join buffer4 with ~, get a string: ", s);

/**
 * buffer4:  01 02 03 01 61 61 05
 *        低地址 ----------------> 高地址
 */
var numberLE = buffer4.readInt16LE(0); // 读出 02 01 即 2*16^2+1
var numberBE = buffer4.readInt16BE(0); // 读出 01 02 即 1*16^2+2
console.log("小端读取结果: ", numberLE);
console.log("大端读取结果: ", numberBE);

buffer4.writeInt8(12, 6);
console.log("after write operation, buffer4: ", buffer4);

// buffer 还有更多的方法，这些方法与数组中的方法一样
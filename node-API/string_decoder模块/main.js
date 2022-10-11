/**
 *  用于将Buffer对象转换为String
 */
const { StringDecoder } = require("string_decoder");

/** 构造函数默认采用 utf8编码方式 */
const decoder = new StringDecoder();
const buffer = Buffer.from("Hello everyone ");
console.log("buffer is ", buffer);

/**
 *  将buffer写入到decoder中，返回转换后的字符串；
 *  end方法转换剩余字节码；
 *  与 流对象不同，调用完end方法后，还可以调用write写入新的字节码，
 *  完成下一段字节码的转换工作
 */
const string = decoder.write(buffer);
const string2 = decoder.end();
console.log("after decode, convert bytes to string: ", string);
console.log(" end方法内没有参数， 所以没有转换任何字节码，得到的结果也是空的: ", string2);
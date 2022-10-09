/** 类似C 的字符串格式化 */

const util = require("util")

/**
 * format   类似于C语言中的printf函数
 *          %d  number
 *          %i  Int型number
 *          %f  浮点数
 *          %s  String
 *          %j  JSON     键名带着双引号
 *          %o  Object   键名不带双引号
 */
const result = util.format("%s %d %f %j %o", "hello", 21, 14.531, { name: "Jack" }, { name: "Jack" });
console.log(result);
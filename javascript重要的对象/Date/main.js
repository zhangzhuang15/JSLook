/**
 * UTC是世界标准时，使用原子钟计算时间；GMT是以前的世界标准时，使用地球自转和公转计算出来，有误差，无法作为精准
 * 时间使用，但是应付平时的时间问题就够了。它们都是以格林威治时间作为基准参考。
 */

var now = new Date();
var moment = new Date(2005, 3, 27, 15, 32, 20); // 2005年4月27日15点32分20秒

console.log("now date：", now.getDate());  // date取年月日中的日
console.log("now hour: ", now.getHours());
console.log("now minutes: ", now.getMinutes());
console.log("now seconds: ", now.getSeconds());
console.log("now milliseconds: ", now.getMilliseconds());
console.log("now day : ", now.getDay());  // day取星期几， 0表示星期日
console.log("now year: ", now.getFullYear());
console.log("now month: ", now.getMonth()); // 取月份，0表示1月
console.log("now time: ", now.getTime());
console.log("now time zone offset: ", now.getTimezoneOffset()); // 世界标准时和本地时间的时间差，
                                                                // 以分钟计算，负数表示世界时比本地时慢

console.log("now utc date: ", now.getUTCDate()); // 转换为世界时，获取世界时日期
console.log("now to json: ", now.toJSON());
console.log("now to ISO string: ", now.toISOString()); // 将时间按照UTC时区转换为ISO格式
console.log("now to UTC string: ", now.toUTCString()); // 将时间转换为UTC时区字符串
console.log("now to date string: ", now.toDateString()); // 返回  星期 月 日 年 字符串
console.log("now to time string: ", now.toTimeString()); // 显示本地时区 时：分：秒

// 将getXXX方法的get换成set，之后追加参数就是set方法了
moment.setDate(30);
console.log("moment to string: ", moment.toString());

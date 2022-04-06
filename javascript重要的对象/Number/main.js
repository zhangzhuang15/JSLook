/**
 * 安全最大值和非安全最大值的区别在于，
 * 如果一个数值超过安全最大值后，在一些逻辑比较、加减法运算上，将不会准确，
 * 如 2**53 === 2**53 + 1 就是一个典型的例子
 * 超过非安全最大值，将被认为是Infinite
 */
const Max = Number.MAX_VALUE;
const Min = Number.MIN_VALUE;
const MaxSafe = Number.MAX_SAFE_INTEGER; 
const MinSafe = Number.MIN_SAFE_INTEGER;
const Nan = Number.NaN;
const infinite = Number.POSITIVE_INFINITY;

var list = { Max, Min, MaxSafe, MinSafe, Nan, infinite };
Object.keys(list).forEach(key => {
    console.log(`${key}:\t${list[key]}`);
});


console.log("Infinity is Finite? ", Number.isFinite(Infinity));
console.log("23.0 is integer? ", Number.isInteger(23.0)); // 注意这个返回的是 true!!!
console.log("'a' is NaN? ", Number.isNaN('a'));
console.log("2**53 is safe integer? ", Number.isSafeInteger(2**53));
console.log("'24.3343' is transformed to float: ", Number.parseFloat("24.3343"));
// parseInt送入两个参数，
// 一个参数是字符串，表示在某个数制下表示的序列， 
// 第二个参数指定什么数制解析第一个参数
console.log("'043' in hex representes value: ", Number.parseInt('043', 16));

var p = 24.554;
var ex = p.toExponential(2); // 表示成指数，小数点后保留2位, 返回字符串
var f = p.toFixed(1); // 小数点后保留1位，返回字符串
var prec = p.toPrecision(3); // 保留3位有效数字，返回字符串
var s = p.toString(16); // 转成 16 数制的表达，返回字符串
console.log("p: ", p);
console.log("p.toExponential(2): ", ex);
console.log("p.toFixed(1): ", f);
console.log("p.toPrecision(3): ", prec);
console.log("p.toString(16): ", s);
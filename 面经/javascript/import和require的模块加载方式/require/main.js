const util1 = require("./util");

// require引入的模块，是按照值深拷贝的；
// 也就是说，无论你怎么修改 util1 的数据，都不会影响到 util2；
// 可为了性能优化，引入的模块会被放进 require.cache 中，
// 当第二次require相同模块时，会从cache里拿到。

// 如果没有下面删除缓存的代码，util1 严格等于 util2，
// 你对util1所做的任何操作，都会被 util2同步
const modulePath = require.resolve("./util");
delete require.cache[modulePath];

const util2 = require("./util");

util1.value = 30;

console.log("util2.value: ", util2.value);

util1.data.msg = "great";

console.log("util2.data.msg: ", util2.data.msg);

console.log("util1 === util2: ", util1 === util2)
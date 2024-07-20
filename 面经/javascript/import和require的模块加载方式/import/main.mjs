import * as util from "./util.mjs";
import { log, num, increase } from "./fn.mjs";

log();

util.data.msg = "world";

log();

// num 的定义是一个 number，
// 但是在 import 引入的时候，并不是引入的num的值，
// 而是 num 变量的地址，在 increase 调用之后，
// num 的值也更新了

console.log("num: ", num);

increase();

console.log("num: ", num);

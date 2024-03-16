var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  hello: () => hello
});
var hello;
var init_utils = __esm({
  "utils/index.ts"() {
    hello = () => console.log("hello");
  }
});

// utils/add.ts
var add = (a, b) => a + b;

// index.ts
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
Promise.resolve().then(() => (init_utils(), utils_exports)).then(({ hello: hello2 }) => {
  hello2();
});
var t = add(1, 2);
console.log("1 + 2: ", t);
var require2 = createRequire(import.meta.url);
var Bobby = require2("./data.json");
console.log("Bobby: ", Bobby);
console.log("__filename: ", fileURLToPath(import.meta.url));

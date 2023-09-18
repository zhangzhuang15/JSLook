import { hello } from "./utils";

// 💥 in this way, you cannot access add if you use
// ts-node or tsc, because they won't replace
// "@/add" according to `paths` of tsconfig.
// import { add } from "@/add";

// you can access json file directly, Great! 🎉
import config from "./data.json";

hello();

console.log("ts config: ", config);

// you can access __dirname directly, Great!🎉
console.log("dirname: ", __dirname);

// you can use require too, but you lose the type hints sadly 💔
const path = require("path");
console.log("url: ", path.join("/a", "./b"));

// you can use require to access module created by yourself, Great!🎉
const { hello: h } = require("./utils");
h();

// console.log("1 + 2: ", add(1, 2));
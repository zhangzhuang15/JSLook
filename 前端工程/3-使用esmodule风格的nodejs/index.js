import path from "path"

// Question 1: 
// in EsModule, you cannot access __dirname directly!
//
// console.log("dirname: ", __dirname);

// try this way:
const url = new URL(path.dirname(import.meta.url));
console.log("dirname: ", url.pathname);


// Question 2:
// you cannot access .node file by key word `import` or `import()` method,
//
// const node = require("./help.node")

// try this way:
// import { createRequire } from "node:module";
// const require = createRequire(import.meta.url);
// const lineNoise = require("./help.node");


// Question 3:
// you cannot access .json file by key word `import` or `import()` method
//
// import package from "./package.json"

// try these ways:
// 1. the resolution of Question 2;
// 2. import package from "./package.json" assert { type: "json" }, node v16.14.0 or v17.1.0
// 3. import("./package.json", { assert: { type: "json" } }), node v16.14.0 or v17.1.0
// 4. use fs module to read it, and parse it with JSON.parse

// Note that:
// when you write nodejs code in typescript, you can access __dirname and import json file
// following these tsconfig conditions below:
// 1. module is "CommonJS"
// 2. resolveJsonModule is true
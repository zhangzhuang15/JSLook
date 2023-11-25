// utils/index.ts
var hello = () => console.log("hello");

// utils/add.ts
var add = (a, b) => a + b;

// index.ts
var import_node_url = require("node:url");
var import_node_module = require("node:module");
var import_meta = {};
hello();
var t = add(1, 2);
console.log("1 + 2: ", t);
var require2 = (0, import_node_module.createRequire)(import_meta.url);
var Bobby = require2("./data.json");
console.log("Bobby: ", Bobby);
console.log("__filename: ", (0, import_node_url.fileURLToPath)(import_meta.url));
console.log("__dirname: ", __dirname);

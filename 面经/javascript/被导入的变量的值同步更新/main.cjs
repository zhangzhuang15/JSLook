const m = require("./module_2.cjs");
const json = require("./hello.json");

// error!
// const { value } = require("./module_1.cjs");
// value = 10;

const n = require("./module_1.cjs");
n.value = 10;

json.name = "jack";
m.echo();
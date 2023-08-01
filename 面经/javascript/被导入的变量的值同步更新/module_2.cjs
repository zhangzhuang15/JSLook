const n = require("./module_1.cjs");
const json = require("./hello.json");

exports.echo = function echo() {
    console.log("echo value: ", n.value);
    console.log("json name: ", json.name);
}
import n, { data } from "./module_1.mjs";
import json from "./hello.json" assert { type: "json" };

export function echo() {
    console.log("echo value: ", n.value);
    console.log("echo data: ", data);
    console.log("json name: ", json.name);
}
import {echo} from "./module_2.mjs";
import n, { data } from "./module_1.mjs";
import json from "./hello.json" assert { type: "json"};

console.log("main value: ", n.value);
n.value = 10;
console.log("main value: ", n.value);

json.name = "jack";

// error!
//  data = 10;
echo();

console.log(import.meta.customer);

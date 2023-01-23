name = "Johon";

function tell(message) {
    console.log(message," ",  this.name);
}

function handlerOfApply(target, thisArg, argArray) {
    console.log("target: ", target);
    console.log("thisArg: ", thisArg);
    console.log("argArray: ", argArray);
    target.call(thisArg || global, ...argArray);
}


var proxyTell = new Proxy(tell, 
                          {
                              apply: handlerOfApply     // 劫持到 tell函数，this指针，tell函数的实参
                          }
);

proxyTell("Hello World");

console.log();

proxyTell.call({ name: "Peter"}, "hello World");
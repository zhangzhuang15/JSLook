var addon = require('../native');

console.log(addon.hello());

const highterOne = addon.the_higher(24, 18);

console.log("the higher one is ", highterOne);

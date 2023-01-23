
// eval
var num = eval('1+2');
console.log("num: ", num);
console.log();


// isFinite
console.log("1/0 is a finite number ? ", isFinite(1/0));
console.log();


// isNaN
console.log("1/0 isNaN ? ", isNaN(1/0));
console.log("100P isNaN ? ", isNaN('100P'));
console.log();


// parseFloat
var f = parseFloat("2.55656");
console.log("parse '2.55656' to float number: ", f);
console.log();


// parseInt
var p = parseInt("34");
console.log("parse '34' to Int number: ", p);
console.log();



// encodeURI 和 encodeURIComponent都会将url做转译, 但并不是所有的字符它们都会被转译
// encodeURI不会转译的字符，encodeURIComponent也可能会转译
const encoded = encodeURI("https://mozilla.org/?word=MacBookPro&year=2021#interface");
console.log("encoded URI: ", encoded); // https://mozilla.org/?word=MacBookPro&year=2021#interface
const url = decodeURI(encoded);
console.log("decoded url: ", url);
const encodedComponent = encodeURIComponent(url);    // https%3A%2F%2Fmozilla.org%2F%3Fword%3DMacBookPro%26year%3D2021%23interface
console.log("encodedComponent: ", encodedComponent);
const url2 = decodeURIComponent(encodedComponent);
console.log("url2: ", url2);

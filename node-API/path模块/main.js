/**
 *  used to deal with the file path string
 */
const path = require("path");

var basename = path.basename("/app/test/index.js");  //  index.js
console.log("/app/test/index.js --> basename:", basename);

var dirname = path.dirname("/app/test/index.js");  // /app/test
console.log("/app/test/index.js --> dirname:", dirname);

var extname1 = path.extname("/app/test/index.js");  // .js
console.log("/app/test/index.js --> extname:", extname1);

var extname2 = path.extname(".index"); // " "
console.log(".index --> extname:", extname2);

var pathname = path.format({
    dir: '/app/test',
    root: '/root',
    base:'index.js',
    name: 'index',
    ext: '.html',
});                    // dir is prior than root; base is prior than name and ext
console.log("pathname:", pathname);

var isAbsolute = path.isAbsolute("./app/index.js"); // false
console.log("./app/index.js  is absolute filepath ? ", isAbsolute);

var pathname2 = path.join(__dirname, 'path_demo.js'); //  /Users/zhanzhuang/Project/FrontEndProject/js_demo/path_demo.js
console.log("pathname2 is joint by __dirname and path_demo.js :", pathname2);
console.log("__dirname:", __dirname); 
console.log("__filename:", __filename);


var normalizedPath = path.normalize("/app/./test/../root/index.js"); // nromalize the path string
console.log("normalize the path /app/./test/../root/index.js : ", normalizedPath);

var pathObj = path.parse("/app/root/index.js"); // the reverse process of path.format()
console.log("parse the path /app/root/index.js to an Object : ", pathObj);

var relativePath = path.relative("/app/root/test/index.js", "/app/test/root/index.js");
// from /app/root/test/index.js to /app by  ../../
// from /app to /app/test/root/index.js by test/root/index.js
// so ../../test/root/index.js
console.log("from /app/root/test/index.js to /app/test/root/index.js relative path: ", relativePath);

var absoluetePath = path.resolve("/app", "root", "./test/index.js", "../");  // parse and return absolute path
// cd /app        you're in /app
// cd root        you're in /app/root
// cd ./test/index.js   you're in /app/root/test/index.js
// cd ../         you're in /app/root/test
console.log("absolutepath: ", absoluetePath);

console.log(`in posix, we use ${path.sep} to seperate the path`);

/** 将函数封装为带过气信息输出的函数 */
const util = require("util")


function showVersion(version) { console.log("version: ", version) }

var deprecateShowVersion = util.deprecate(showVersion, "2022.12.12将被弃用", "2")

deprecateShowVersion("2.2.0")
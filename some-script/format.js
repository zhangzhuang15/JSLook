#! /usr/bin/env node

// 从网络下载的html文件，里面个格式很乱，不适合阅读，
// 用此脚本可以将其格式化，方便阅读
const b = require("simply-beautiful");
const fs = require("fs");
const html = fs.readFileSync(process.argv[2]).toString();
process.stdout.write(b.html(html));
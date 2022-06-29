const s = "2022nian10yue34"

let match = s.matchAll(/\d+/g)
console.log(match)
console.log(typeof match)
console.log(match instanceof Array)
console.log(Object.prototype.toString.call(match))


for(let v of match) {
    console.log(v)
}

// matchAll 必须搭配 含有g的正则表达式
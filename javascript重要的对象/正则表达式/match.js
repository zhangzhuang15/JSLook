const s = "2022年5月3日3434"

let match = s.match(/\d+/)
console.log(match)
console.log(typeof match)
console.log(match instanceof Array)

match = s.match(/\d+/g)
console.log(match)
console.log(typeof match)
console.log(match instanceof Array)

// 有g , 没g , 真不一样
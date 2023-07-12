const reg = /\d+/g

let match = reg.exec("2022年8月27日")

console.log(match)

match = reg.exec("2023年8月27日")

console.log(match)


// 带有g的正则表达式，再调用exec的时候，具备记忆性
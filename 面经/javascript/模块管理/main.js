const p = require('./values')

const t = require('./values')

// 基本数据类型，值拷贝，后续不受影响
// 数组类型，引用拷贝，后续会受影响
const { name, age, scores } = require('./values')

// 对 t 做修改， p修改也同步到了 p 上；
// 原因是 t 和 p 都是引用类型数据，而且是同一个引用
t.name = 'peter'
t.age = 23
t.scores.push(17)

console.log('p: ', p)

console.log('t: ', t)

// name 和 age 不受影响，拷贝的是值；
// scores 会受到影响
console.log('name: ', name)
console.log('age: ', age)
console.log('scores: ', scores)

// t 和 p 是同一个对象的引用，
// t 给 scores 换了一个新的引用，
// p 也会受到影响，但是 scores 却不会
t.scores = []
console.log('t: ', t)
console.log('p: ', p)
console.log('scores: ', scores)

// tt.scores 并不是 [34]，
// 表示 require不会重新引入，而是从内存中直接拿
const tt = require('./values')
console.log('tt: ', tt)
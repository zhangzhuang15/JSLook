const LRU = require('./lru.js')

let lru = new LRU(4)

lru.set('name', 'zhang')
lru.set('age', 45)
lru.set('food', 'dumplings')
lru.set('salary', '18k')

console.log(''+lru)  // name,age,food,salary

lru.get('dollar')
console.log('' + lru) // name,age,food,salary

lru.get('age')
console.log('' + lru) // name,food,salary,age

lru.set('books', '解忧杂货铺')
console.log('' + lru) // food,salary,age,books
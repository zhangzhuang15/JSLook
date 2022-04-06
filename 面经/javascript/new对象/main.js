function Jack(name) {
    this.name = name
}

function Bob(name) {
    this.name = name
    return name
}

function Tom(name) {
    this.name = name
    return { name }
}


const jack = new Jack('jack')
const bob = new Bob('bob')
const tom = new Tom('tom')

console.log(jack)   // Jack { name: 'jack' }
console.log(bob)    // Bob { name: 'bob' }
console.log(tom)   // { name: 'tom'}


console.log( 'foo' == new function(){ return String('foo')})     // false
console.log( 'foo' == new function(){ return new String('foo')}) // true

//  Bob 中 return name，
//  但实际上，返回的却是一个 Bob 对象， 不是 name 这个字符串
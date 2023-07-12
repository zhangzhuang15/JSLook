function outer() {
    return function() {
        console.log(this)    
    }
}

const out = outer()
out()     // this此时是指 global
new out() // this此时是指 {}


var age = 16

function getAge() {
    return function() {
        console.log(this.age)
    }
}
const get = getAge()
get()                  
// node 环境下， this指 global, 但是 age 不是global的属性。
// 浏览器环境下， this指 window, age 是window的属性。
// 
// 在node环境下，打印 undefined； 在浏览器环境下，打印16.
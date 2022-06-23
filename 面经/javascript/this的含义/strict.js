'use strict'

// 严格模式下，普通函数的this指向undefined
function callc() {
    console.log("callc: ", this)
}

// 严格模式下，this 指向 实例
function Man() {
    this.name = 'Charles'
    console.log("Man: ", this)
}

class Animal {
    constructor() {
        this.run = () => { console.log('running')}
    }
    // 浏览器环境中，this 指向 undefined
    speak() {
        console.log("Animal speak: ", this)
    }
    
    // node 和 浏览器环境中， this 都指向实例
    eat = () => {
        console.log("Animal eat: ", this)
    }
}

callc()

const m = new Man()

const dog = new Animal()
dog.speak()
dog.eat()

// 报错！ run 定义在实例身上，没有定义在实例的原型身上
Animal.prototype.run()
dog.run()


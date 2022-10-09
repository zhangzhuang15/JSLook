const dog = { 
    name: 'Lucy', 
    get speak() {
        console.log(this.name)
    } 
}

const proxy = new Proxy(dog, {
    get: function(target, property, receiver) {
        return Reflect.get(target, property, receiver)
        // return Reflect.get(target, property, receiver)
    }
})

const cat = Object.create(proxy)
cat.name = "David"

const rat = Object.create(cat)
rat.name = "Nancy"

rat.speak


// 将 第10行注释，第11行打开注释，
// 再运行一次，你会发现Reflect将this.name的this修改为receiver
//
// rat.speak -> cat.speak -> proxy.speak -> console.log(this.name)
// 默认情况下， this === dog === target,
// receiver === rat

// 使用 Proxy时，少不了使用 Reflect
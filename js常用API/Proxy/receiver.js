const dog = { 
    name: 'Lucy', 
    get speak() {
        console.log(this.name)
    } 
}

const proxy = new Proxy(dog, {
    get: function(target, property, receiver) {
        // this will log Nancy
        return Reflect.get(target, property, receiver)
        // this will log Lucy
        // return Reflect.get(target, property)
    }
})

const cat = Object.create(proxy)
cat.name = "David"

const rat = Object.create(cat)
rat.name = "Nancy"

rat.speak

 
// rat.speak -> cat.speak -> proxy.speak -> console.log(this.name)
// 默认情况下， this === dog === target,
// receiver === rat

// 使用 Proxy时，少不了使用 Reflect
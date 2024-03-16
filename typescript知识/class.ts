class A {
    private name = "jack"
    node?: typeof this

    hello() {
        console.log("hello")
    }

    log() {
        console.log(this.name)
        this.hello()
    }
}

class B extends A {
    constructor() {
        super()
    }

     hello() {
        console.log("write")
    }

    // log() {
    //     super.log()
    //     console.log("ok")
    // }
    
}

new B().log()


type M<T> = 'type' extends keyof T ? T['type'] : never

interface P {
    type: A
}

interface O {
    type: B
}

type t = M<O>
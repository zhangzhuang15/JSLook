function A() {
    try {
        B(a)
    } catch(e) {
        console.log(e.message)
    }
}

a = { 
    next: () => console.log('yes'),
    leave: () => { throw Error('leave') } }


function B({ next, leave }) {
    console.log('go B func')
    leave()
    console.log('go A')
}

A()


class PipeRunner {
    globalData = null
    middleData = null
    runners = []
    runnerMap = new Map()
    iterator = null

    leave = function(data) {
        data && (this.middleData = data)
        throw Error('leave')
    }

    end = function(data) {
        data && (this.middleData = data)
        throw Error('end')
    }

    skip = function(steps) {
        for(let i = 0; i < steps; i += 1) this.iterator.next()
        this.leave()
    }

    skipTo(runnerName) {
        const index = this.runners
    }


}

class p {
    age = 5
    name = function() {
        console.log(this.age)
    }
}

const t = new p()
t.name()
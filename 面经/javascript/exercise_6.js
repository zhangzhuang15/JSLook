function outer() {
    return function() {
        console.log(this)    
    }
}

const out = outer()
out()     // this此时是指 global
new out() // this此时是指 {}
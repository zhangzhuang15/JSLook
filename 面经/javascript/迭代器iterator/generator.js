// generator is special iterator

function* G() {
    console.log('a')
    const b = yield 'b'
    const c = b + 'c'
    const d = yield c
    return d
}

const g = G()

console.log(g.next())
console.log(g.next('t'))
console.log(g.next())
console.log(g.next())

const p = G()
for(const t of p) {
    console.log(t)
}
var a, b

(function(){
    console.log("inner: ", a)
    console.log("inner: ", b)
    var a=b=2
    console.log("inner: ", a)
    console.log("inner: ", b)
})()

console.log("outer: ", a)
console.log("outer: ", b)

console.log()

var c, d
function show() {
    console.log("inner: ", c)
    console.log("inner: ", d)
    var c=d=100
    console.log("inner: ", c)
    console.log("inner: ", d)
}

show()
console.log("outer: ", c)
console.log("outer: ", d)

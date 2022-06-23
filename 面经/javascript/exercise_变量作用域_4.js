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
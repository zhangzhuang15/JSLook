setTimeout( () => console.log("1"), 0)

setTimeout( () => new Promise( resolve => {
    console.log("2")
    resolve(3)
})
.then(data => console.log(data))
, 0)

console.log(4)
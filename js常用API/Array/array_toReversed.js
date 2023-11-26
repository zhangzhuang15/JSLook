const source = [1, 3, 4, { name: "jack" }]

const reversed = source.toReversed()

console.log("source: ", source)

console.log("reversed: ", reversed)

// not deep copying
reversed[0].name = "peter"

console.log("source: ", source)

console.log("reversed: ", reversed)


// toReversed is supported by node v20

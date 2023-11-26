const source = [1, 3, { name: "jack" }]

const spliced = source.toSpliced(1, 1, 100)

console.log("source: ", source)

console.log("spliced: ", spliced)

// not deep copying
spliced[2].name = "peter"

console.log("source: ", source)

console.log("spliced: ", spliced)
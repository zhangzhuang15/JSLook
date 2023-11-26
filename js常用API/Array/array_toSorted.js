const source = [{ age: 10 }, { age: 5 }]

const sorted = source.toSorted((a, b) => a.age - b.age)

console.log("source: ", source)

console.log("sorted: ", sorted)

// not deep copying
sorted[0].age = 6

console.log("source: ", source)
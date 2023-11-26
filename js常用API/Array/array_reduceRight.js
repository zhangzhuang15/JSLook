const source = [1, 2, 4]

source.reduceRight((tail, prev) => {
    console.log("prev: ", prev)
    return tail + prev
}, 0)
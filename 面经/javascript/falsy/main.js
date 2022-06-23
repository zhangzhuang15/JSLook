// 在 javascript 中，当涉及到数据类型转化为boolean的场合，
// 以下数据会被转化为 false，这些数据就是falsy数据

Boolean("")
Boolean('')
Boolean(null)
Boolean(undefined)
Boolean(NaN)
Boolean(0)
Boolean(-0)
Boolean(0n)
Boolean(false)

// Boolean([])   -> true
// Boolean({})   -> true 
console.time('count time')

setTimeout( _ => {
    console.log('hello world')
    console.timeEnd('count time')
}, 4 * 1000)
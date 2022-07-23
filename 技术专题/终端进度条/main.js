const stdout = process.stdout

let len = 1

stdout.write('ok, next line is progress bar: 👇 \n')
const timer = setInterval(() => {
    const bar = `${'🟩'.repeat(len)} length=${len} columns=${stdout.columns}`
    if (bar.length > stdout.columns) {
        clearInterval(timer)
        return
    }
    stdout.cursorTo(0)
    stdout.clearLine(1)
    stdout.write(bar)
    len += 5
}, 1000)
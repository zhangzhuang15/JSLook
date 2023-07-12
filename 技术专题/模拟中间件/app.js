class App {
    constructor(req, res) {
        this.handlers = []
        this.index = -1
        this.req = req || { name: "Wars" }
        this.res = res || { name: "Peter" }
    }

    next(err) {
        this.index += 1
        const handler = this.handlers[this.index]

        // handler的参数个数超过4，则应传参 err, req, res, next
        if(handler.length >= 4) {
            try {
                handler && handler(err, this.req, this.res, this.next.bind(this))
            } catch(e) {
                console.log(e)
            }
        } else {
            if(err instanceof Error) {
                /** 处理错误 */
                console.log(`err name: ${err.name}`)
                console.log(`err message: ${err.message}`)
            }
            try {
                handler && handler(this.req, this.res, this.next.bind(this))
            } catch(e) {
                console.log(e)
            }
            
        }
    }

    use(handler) {
        this.handlers.push(handler)
        return this
    }

    run() {
        this.next()
    }
}

module.exports = App
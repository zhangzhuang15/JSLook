const App = require('./app')

let req = { name: 'Jack', age: 14 }
let res = { name: 'Morphy', age: 14 }


const middlewareOne = (req, res, next) => {
    req.age += 2
    res.age -= 2
    next()
    console.log("middlewareOne ends")
}

const middlewareTwo = (req, res, next) => {
    req.name = req.name.toLowerCase()
    next()
    res.age -= 1
    console.log("middlewareTwo ends")
    next(new Error("fake err"))
}

const middlewareThree = (req, res, next) => {
    console.log("req: " + JSON.stringify(req))
    console.log("res: " + JSON.stringify(res))
    console.log("middlewareThree ends")
}

const app = new App(req, res)
app
.use(middlewareOne)
.use(middlewareTwo)
.use(middlewareThree)

app.run()
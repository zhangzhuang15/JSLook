import "./asset/style/main.css"
import "./asset/style/main.scss"
import workerResult from "./worker.js"


// eslint-disable-next-line no-unused-vars
export const doSomthing = (...args) => {
  console.log("args: ", args)
}


export const run = () => {
  const worker = new Worker(workerResult)
  worker.onmessage(e => {
    console.log("hello: ", e.data)
  })
  worker.postMessage({ data: " great "})
}

console.log("result: ", workerResult)
const button = document.getElementById("button")
button.addEventListener("click", _ => {
    createWorkerAndDo(10, 50)
    .then( data => {
        window.alert("result: " + data)
    })
})

function createWorkerAndDo(start, end) {
    return new Promise( resolve => {
        const worker = new Worker("worker.js")
        const job = { start, end }
        worker.postMessage(job)
        worker.addEventListener("message", e => {
            resolve(e.data.result)
        })
    }) 
}
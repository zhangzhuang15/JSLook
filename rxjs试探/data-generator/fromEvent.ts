import { fromEvent } from "rxjs";
import { EventEmitter } from "node:events";

const eventMaker = new EventEmitter();
eventMaker.addListener("message", (msg) => {
    console.log("message: ", msg)
})

function run() {
    fromEvent(eventMaker, "message")
      .subscribe(msg => console.log("subscribed msg: ", msg))

    console.log("start...")

    setTimeout(() => eventMaker.emit("message", "hello peter poll"), 1_000)
}

run()
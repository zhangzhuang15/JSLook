import { fromEvent, interval, takeUntil } from "rxjs"
import { EventEmitter } from "node:events"

function run() {
    const eventMaker = new EventEmitter()
    eventMaker.addListener("message", (msg) => console.log("from message event: ", msg))
    setTimeout(() => eventMaker.emit("message", 10_000), 10_000)
   
    const notifier = fromEvent(eventMaker, "message")

    interval(1_000)
      .pipe(
        takeUntil(notifier)
      )
      .subscribe(console.log)

    notifier.subscribe(v => console.log("from notifier: ", v))
}

run()
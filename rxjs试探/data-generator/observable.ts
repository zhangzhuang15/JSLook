import { Observable } from "rxjs"

function run() {
    const observable = new Observable((subscriber) => {
        for (const item of [1, 3, 4, 2]) {
            subscriber.next(item);
        }

        subscriber.error(new Error("data is clear"))
        subscriber.complete()
    })

    observable.subscribe({
        next: (value) => console.log("consume value: ", value),
        error: (err) => console.error(err.toString()),
        complete: () => console.log("data is done")
    })
}

run()
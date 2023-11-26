import { of, share, tap } from "rxjs"

function run() {
    const observable = 
        of(1, 7, 9, 10, 4, 2)
        .pipe(
            tap(v => console.log("value value:", v)),
            share()
        )
    
    observable.subscribe(v => console.log("subscriber 1: ", v))
    observable.subscribe(v => console.log("subscriber 2: ", v))
}

run()
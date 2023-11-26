import { of, mergeMap } from "rxjs"

function run() {
    of(1, 3, 4)
      .pipe(
        mergeMap((value) => of(value+2, 1))
      )
      .subscribe(console.log)
}

run()
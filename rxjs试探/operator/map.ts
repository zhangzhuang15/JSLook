import { of, map } from "rxjs"

function run() {
    of(2, 4, 8, 10, 32)
      .pipe(
        map((value) => value/2)
      )
      .subscribe(console.log)
}

run()
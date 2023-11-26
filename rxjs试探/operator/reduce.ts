import { reduce, of } from "rxjs";

function run() {
    of(1, 4, 2, -4, 9)
      .pipe(
        reduce((state, next) => {
            if (next > 3) {
                return state + next
            }

            return state
        }, 0)
      )
      .subscribe(console.log)

}

run()
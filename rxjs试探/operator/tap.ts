import { of, tap } from "rxjs"

function run() {
    of(3, 2, 10, 9, 7)
      .pipe(
        /**
         * tap用于 side effects，不要在 tap 里面
         * 修改 value！
         */
        tap((value) => {
            if (value > 5) console.log("value > 5")
        })
      )
      .subscribe(console.log)
}

run()
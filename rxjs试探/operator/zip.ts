import { of, zip, map } from "rxjs"

function run() {
    const fruite = of("apple", "banana", "orange")
    const scores = of(10, 12, 5)

    zip(fruite, scores)
      .pipe(
        map(([fruite, score]) => `${fruite}: ${score}`)
      )
      .subscribe(console.log)
}

run()
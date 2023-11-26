import { filter, of } from 'rxjs';

function run() {
    of(1, 3, 4, 10, 6)
      .pipe(
        filter((item) => item > 4)
      )
      .subscribe(console.log)
}

run()
const createDeferedPromise = () => {
    let resolve, reject;
    const promise = new Promise((r, rj) => {
        resolve = r;
        reject = rj;
    });

    return { resolve, reject, promise }
}

/**
 * 返回一个Promise消费池函数。
 * 
 * 最多只能有limit个Promise在处理中，只有这limit个Promise其中
 * 一个处理完毕后，才能处理新的Promise.
 * 
 * 注意：这limit个Promise不是concurrent的
 * 
 
 * 
 * 
 * ## Example
 * 
 * ```ts 
 * const tasks = [
 *    Promise.resolve(10), 
 *    Promise.resolve(20),
 *    Promise.resolve(30),
 *    Promise.resolve(40),
 *    Promise.reject(50)
 * ]
 * 
 * const consumePromises = createPromiseConsumerPool(3);
 * const result = consumePromises(tasks);
 * result.then(([value1, value2, value3, value4, error1]) => {
 *     console.log(value1)
 *     console.log(value2)
 *     console.log(value3)
 *     console.log(value4)
 *     console.log(error1)
 * })
 * 
 * // output:
 * // 10
 * // 20
 * // 30
 * // 40
 * // 50
 * ```
 * 
 * @param limit 消费池大小
 */
const createPromiseConsumerPool = (limit: number) => {
    let count = 0;

    return function consumePromises(tasks: Promise<any>[]) {
        const total = tasks.length;
        const queue = tasks.slice();
        const result: any[] = [];
        const { resolve, promise } = createDeferedPromise();

        const consumeNextPromise = () => {
            const task = queue.pop()!;
            count++;
            task
              .then(value => result.push(value))
              .catch(error => result.push(error))
              .finally(() => {
                count--;
                
                if (result.length === total) {
                    resolve(result);
                    return;
                }

                if (count < limit && queue.length > 0) {
                    consumeNextPromise()
                }
              })
        }

        while (count < limit && queue.length > 0) {
            consumeNextPromise();
        }

        return promise;
    }
}
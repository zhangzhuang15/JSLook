function createIteratorFrom(array) {
    const _array = [...array]
    let index = 0;

    return {
        next() {
            if (index < _array.length) {
                return { value: _array[index++], done: index > _array.length }
            }
            return { value: _array[index], done: true }
        }
    }
}

const iterator = createIteratorFrom([1, 'jack', 4]);

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
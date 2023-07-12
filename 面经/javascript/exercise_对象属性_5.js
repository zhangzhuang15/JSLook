var a = {},
    b = { key: 'b' },
    c = { key: 'c' };

a[b] = 123
a[c] = 456
console.log(a[b])



// a[b] = 123 等效于 a[b.toString()] = 123,
//   a['[object Object]'] = 123,
// a[c] = 456 等效于 a[c.toString()] = 456,
//   a['[object Object]'] = 456
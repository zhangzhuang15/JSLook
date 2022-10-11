var p = [1 , 10, 2, 5, 4];
// sort会修改数组本身，因此需要用 q 再拷贝一份
var q = Array.from(p);

// 从小到大
// 如果 first - second > 0, 那么 first 排在 second 后边；
// 如果 first - second < 0, 那么 first 排在 second 前边；
// 等于0， 位置不变
var m = p.sort((first, second) => first - second);

// 从大到小
var n = q.sort((first, second) => second - first);

console.log("p: ", p, "\tm: ", m);
console.log("q: ", q, "\tn: ", n);
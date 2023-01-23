var p = [1, 2, 4, 7];

var m = p.map(item => {
    if(item > 3) return item - 1;
    else return item + 1;
});

console.log("p: ", p, "\tm: ", m);
var p = [2, 5, 1, 10];

var m = p.forEach( (item, index, array) => {
    if(item > 5) p[index] = item - 5;
    else array[index] = true;
});

console.log("p: ", p, "\tm: ", m);
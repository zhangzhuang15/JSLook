// 1
setTimeout(() => {
    // 1-1
    console.log(1);

    // 1-2                          
    Promise.resolve().then(_ => console.log(2));

    // 1-3
    process.nextTick(_ => console.log(3));
}, 0);

// 2
setTimeout(() => {
    // 2-1
    console.log(4);

    // 2-2                       
    Promise.resolve().then(_ => console.log(5));

    // 2-3
    process.nextTick(_ => console.log(6));
}, 0);


// 3-1
Promise.resolve().then(_ => console.log(7));

// 4-1                         4-2
Promise.resolve().then(_ => setTimeout(() => console.log(8), 0));

// 5-1
process.nextTick(_ => console.log(9));

// 6-1                       6-2
process.nextTick(_ => Promise.resolve().then(_ => console.log(10)));

// 7-1                    7-2               
process.nextTick(_ => setTimeout(() => console.log(11), 0))

// 8-1
console.log(12);


/**
 * node >= 11
 * run script
 * Macro: [1, 2]
 * micro: [5-1, 6-1, 7-1, 3-1, 4-1]
 * output: 12
 * 
 * 
 * run 5-1 6-1 7-1
 * Macro: [1, 2, 7-2]
 * micro: [3-1, 4-1, 6-2]
 * output: 12 9
 * 
 * run 3-1 4-1 6-2
 * Macro: [1, 2, 7-2, 4-2]
 * micro: []
 * output: 12 9 7 10
 * 
 * run 1
 * Macro: [2, 7-2, 4-2]
 * micro: [1-3, 1-2]
 * output: 12 9 7 10 1
 * 
 * run 1-3 1-2
 * Macro: [2, 7-2, 4-2]
 * micro: []
 * output: 12 9 7 10 1 3 2
 * 
 * 
 * run 2
 * Macro: [7-2, 4-2]
 * micro: [2-3, 2-2]
 * output: 12 9 7 10 1 3 2 4
 * 
 * run 2-3 2-2
 * Macro: [7-2, 4-2]
 * micro: []
 * output: 12 9 7 10 1 3 2 4 6 5
 * 
 * run 7-2
 * Macro: [4-2]
 * micro: []
 * output: 12 9 7 10 1 3 2 4 6 5 11
 * 
 * run 4-2
 * Macro: []
 * micro: []
 * output: 12 9 7 10 1 3 2 4 6 5 11 8
 */

/**
 * node < 11, for example node 10.0.0
 * 
 * run script
 * Macro: [1,2]
 * micro: [5-1, 6-1, 7-1, 3-1, 4-1]
 * output: 12
 * 
 * 
 * run 5-1 6-1 7-1
 * Macro: [1, 2, 7-2]
 * micro: [3-1, 4-1, 6-2]
 * output: 12 9
 * 
 * run 3-1 4-1 6-2
 * Macro: [1, 2, 7-2, 4-2]
 * micro: []
 * output: 12 9 7 10
 * 
 * run 1
 * Macro: [2, 7-2, 4-2]
 * micro: [1-3, 1-2]
 * output: 12 9 7 10 1
 * 
 * ⭐️ different here!
 * run 2
 * Macro: [7-2, 4-2]
 * micro: [1-3, 1-2, 2-3, 2-2]
 * output: 12 9 7 10 1 4
 * 
 * run 7-2
 * Macro: [4-2]
 * micro: [1-3, 2-3, 1-2, 2-2]
 * output: 12 9 7 10 1 4 11
 * 
 * run 4-2
 * Macro: []
 * micro: [1-3, 2-3,1-2, 2-2]
 * output: 12 9 7 10 1 4 11 8
 * 
 * run 1-3
 * Macro: []
 * micro: [2-3, 1-2, 2-2]
 * output: 12 9 7 10 1 4 11 8 3
 * 
 * run 2-3
 * Macro: []
 * micro: [1-2, 2-2]
 * output: 12 9 7 10 1 4 11 8 3 6
 * 
 * run 1-2
 * Macro: []
 * micro: [2-2]
 * output: 12 9 7 10 1 4 11 8 3 6 2
 * 
 * run 2-2
 * Macro: []
 * micro: []
 * output: 12 9 7 10 1 4 11 8 3 6 2 5
 */
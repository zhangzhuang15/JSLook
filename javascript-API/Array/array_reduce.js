var p = [4, 5, 6, 7, 10];

p.reduce(
    // pre 初始值 p[0], current 初始值 p[1]
    (pre, current) => {
        console.log("pre: ", pre, "\tcurrent: ", current);
        // 这个值会作为pre的值
        return pre+current;
    }
);

console.log();

p.reduce(
    // 这时 pre 的初始值是1，current初始值是 p[0]
    (pre, current) => {
        console.log("pre: ", pre, "\tcurrent: ", current);
        // 这个值会作为pre的值
        return pre+current;
    },
    1
)
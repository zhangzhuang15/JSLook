function say() {
    console.log("hello world");
    return 1;
}


function run() {
    try {
        console.log(1);
        // say执行，它的返回值暂存起来，然后执行 finally
        return say();
    } finally {
        console.log(2);
        // 将之前暂存的返回值更新为3，之后run函数的返回值就成了3
        return 3;
    }
}

function main() {
    const result = run();
    // 打印3，而不是1
    console.log("result: ", result)
}


main();
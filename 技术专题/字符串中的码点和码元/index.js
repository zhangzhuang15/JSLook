const hello = 'h😱';

// 求码元长度
console.log(hello.length);

/**
 * 为什么打印出来是3不是2呢？
 * 
 * 因为 ‘h’ 是一个字节，‘😱’ 占据2个字节
 * 
 * ‘h’ 是一个码点，占据一个码元；
 * 
 * ‘😱’ 是一个码点，占据两个码元；
 * 
 * 如果你想要得到打印结果是2，就需要利用 hello.codePointAt 获取
 * 码点值，如果这个值大于 2^8 - 1，表明这位置开头的码点占据2个码元，
 * 利用这一点，在遍历码元的时候，可以统计出来码点长度
 */

/**
 * 统计字符串的码点数量
 * @param {string} s 
 */
function countCodePointLength(s) {
    let count = 0;
    for (let i = 0; i < s.length;) {
        const codePointValue = s.codePointAt(i);

        count++;
        if (codePointValue >= (1 << 8)) {
            i += 2;
        } else {
            i += 1;
        }
    }

    return count;
}

// 打印2
console.log(countCodePointLength(hello))

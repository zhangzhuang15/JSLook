/**
 * 计算最大的2的整数幂，要求不能大于 dest
 * @param dest 
 */
const calculateMax2N = (dest: number) => {
    let v = dest;

    while ((v & (v-1)) !== 0) {
        v = v & (v-1)
    }

    return v;
}
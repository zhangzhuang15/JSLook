// NOTE: 数组的一些工具函数


// 数组去重
const getUnique = (array) => [...new Set(array)]

// 数组乱序
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5)

// 数组平均值
const getAverageOfArray = (array) => array.reduce((state, next) => state+next, 0)/array.length

// 数组众数（出现次数大于 Math.floor(array.length/2) 的元素）
const getMajorityElementOfArray = (array) => {
    const elements = array.map(item => item).sort();
    const middle = Math.floor(array.length/2);
    return elements[middle];

    // 其他算法有：哈希法，分治法，Boyer-Moore算法
};
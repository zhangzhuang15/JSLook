// NOTE: 数组的一些工具函数


// 数组去重
const getUnique = (array) => [...new Set(array)]

// 数组乱序
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5)

// 数组平均值
const getAverageOfArray = (array) => array.reduce((state, next) => state+next, 0)/array.length
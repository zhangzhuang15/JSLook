/**
 * 判断是否为工作日
 * @param {Date} date 
 * @returns 
 * @note date.getDay() 返回 0至6 的一个数，周日对应0， 周六对应6
 * 
 * @example
 * ```js
 * const date = new Date("2022-08-03")
 * // true
 * assert.equal(isWeekDay(date), true)
 * ```
 */
const isWeekDay = (date) => date.getDay() % 6 !== 0
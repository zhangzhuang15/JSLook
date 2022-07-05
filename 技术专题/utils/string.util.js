/**
 * 字节串转换为ascii字符串
 * @param {number[] | Buffer } array 
 * @param {number | undefined} length 转为字符串后，截断后的字符个数
 * @param {string | undefined} encode 转为字符串后，字符串所用的编码格式，如'base64'
 * @returns 
 * 
 * @example
 *  ```javascript
 *  const bytes = [104, 101, 108, 108, 111]
 *  let result = bytes2string(bytes)
 *  assert(result, 'hello', true)
 * 
 *  result = bytes2string(bytes, 'base64')
 *  // true
 *  assert.equal(result, 'aGVsbG8=')
 *  ```
 */
 const bytes2string = (array, encode, length) => {
    if (!array) {
        return ''
    } else if (array instanceof Buffer) {
        return length ? array.toString(encode).slice(0, length) : array.toString(encode)
    } else if (array instanceof Array) {
        return length ? Buffer.from(array).toString(encode).slice(0, length) : Buffer.from(array).toString(encode);
    } 
    return ''
}

/**
 * 将字符串转换为另一种编码格式的字符串
 * @param {string | undefined} content 待转换的字符串
 * @param {string | undefined} encode 编码格式
 * @returns 编码后的字符串
 * 
 * @example
 * ```js
 * const s = 'hello'
 * const result = encodeString(s, 'base64')
 * // true
 * assert.equal(result, 'aGVsbG8=')
 * ```
 */
const encodeString = (content, encode) => {
    if (typeof content === 'string') {
        return Buffer.from(content).toString(encode)
    }
    return ''
}

/**
 * 把某种编码格式的字符串解码
 * @param {string | undefined} content 待解码的字符串
 * @param {string | undefined} decode 解码格式
 * @returns 解码后的字符串
 * 
 * @example
 * ```js
 * const s = 'aGVsbG8='
 * const result = decodeString(s)
 * // true
 * assert.equal(result, 'hello')
 * ```
 */
const decodeString = (content, decode) => {
    if (typeof content === 'string') {
        return Buffer.from(content, decode).toString()
    }
    return ''
}
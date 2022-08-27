const toString = Object.prototype.toString
const hasOwnProperty = Object.prototype.hasOwnProperty

const isPlainObject = (obj) => {
    return toString.call(obj) === '[object Object]' &&
    (Object.getPrototypeOf(obj) === null || Object.getPrototypeOf(obj) === Object.prototype)
}


const isObject = (obj) => obj !== null && typeof obj === 'object'

const isString = (s) => typeof s === 'string'

const isNumber = (num) => typeof num === 'number'

const isBoolean = (bool) => typeof bool === 'boolean'

const isUndefined = (obj) => typeof obj === 'undefined'

const isNull = (obj) => typeof obj === 'object' && toString.call(obj) === '[object Null]'

const isEmpty = (obj) => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object

const isFunction = (func) => typeof func === 'function'

const isArray = (array) => toString.call(array) === '[object Array]'

const isBlob = (blob) => toString.call(blob) === '[object Blob]'


const hasOwn = (obj, key) => isObject(obj) && hasOwnProperty.call(obj, key)
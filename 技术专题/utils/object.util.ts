import { equal } from "node:assert";

const getObjectToStringTag = (value: unknown) => Object.prototype.toString.call(value);

/**
 * 判断某个属性是否来自对象的直接定义
 * 
 * 在javascript中，对象的属性一方面来自继承，另一方面来自自身直接定义。in操作符不会
 * 排除来自继承的那些属性，如果该属性无法enumerable, 也不会被in操作符访问到。
 * 
 * @param obj 
 * @param key 
 */
const hasOwnProperty = (obj: unknown, key: any) => {
    if ((Object as any).hasOwn) {
        return (Object as any).hasOwn(obj, key);
    }
    
    // 采用这种写法，为了避免:
    // 1. obj.__proto__ === null
    // 2. hasOwnProperty 被 obj override
    return Object.prototype.hasOwnProperty.call(obj, key);
}

const isPlainObject = (obj) => {
    return getObjectToStringTag(obj) === '[object Object]' &&
    (Object.getPrototypeOf(obj) === null || Object.getPrototypeOf(obj) === Object.prototype)
}


const isObject = (obj) => obj !== null && typeof obj === 'object'

const isString = (s) => typeof s === 'string'

const isNumber = (num) => typeof num === 'number'

const isBoolean = (bool) => typeof bool === 'boolean'

const isUndefined = (obj) => typeof obj === 'undefined'

const isNull = (obj) => typeof obj === 'object' && getObjectToStringTag(obj) === '[object Null]'

const isEmpty = (obj) => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object

const isFunction = (func) => typeof func === 'function'

const isArray = (array) => getObjectToStringTag(array) === '[object Array]'

const isBlob = (blob) => getObjectToStringTag(blob) === '[object Blob]'

const isMap = (value: unknown) =>  getObjectToStringTag(value) === "[object Map]";

const isSet = (value: unknown) => getObjectToStringTag(value) === "[object Set]";

const isWeakMap = (value: unknown) => getObjectToStringTag(value) === "[object WeakMap]";

const isWeakSet = (value: unknown) => getObjectToStringTag(value) === "[object WeakSet]";

const isDate = (value: unknown) => getObjectToStringTag(value) === "[object Date]";

const isRegExp = (value: unknown) => getObjectToStringTag(value) === "[object RegExp]";

const isPromise = (value: unknown) => {
    if (getObjectToStringTag(value) === "[object Promise]") return true;

    return isObject(value) && isFunction((value as any).then) && isFunction((value as any).catch);
};

const getObjectOwnUnSymboledEnumerableKeys = (obj: unknown) => Object.keys(obj as any);

const getObjectOwnUnSymboledKeys = (obj: unknown) => Object.getOwnPropertyNames(obj as any);

const getObjectOwnKeys = (obj: unknown) => Reflect.ownKeys(obj as any);

/**
 * 给对象施加如下限制，并返回该对象：
 * 1. 无法加入新属性
 * 2. 无法删除属性
 * 3. 无法修改属性descriptor
 * 4. 无法修改原型链
 * 5. 已存在的属性，如果本身是可写的，其值依旧可写
 * @param obj 
 */
const onlyObjectValueCanChange = (obj: unknown) => Object.seal(obj);

/**
 * 给对象施加如下限制，并返回该对象：
 * 1. 无法加入新属性
 * 2. 无法删除属性
 * 3. 无法修改属性descriptor
 * 4. 无法修改原型链
 * 5. 已存在的属性，其值无法被修改
 * @param obj 
 */
const makeObjectCannotChange = (obj: unknown) => Object.freeze(obj);


const __test__ = false;

if (__test__) {
    class Jack {
        [Symbol.toStringTag] = "Joker"
    }
    const jack = new Jack();
    equal(getObjectToStringTag(jack), "[object Joker]");
    
}
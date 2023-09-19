
/**
 * 使用 Map 实现LRU
 * 
 * Map在执行set的时候，是有序的，根据这一点，就可以不引入额外的数据结构，实现
 * 最近最少使用的状态跟踪
 */
class LRU {
     constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
     }

     /**
      * 更新 key 在 Map 内部的位置
      * @param {*} key 
      * @param {*} value 
      */
     updateKey(key, value) {
        this.cache.delete(key);
        this.cache.set(key, value);
     }

     get(key) {
        if (this.cache.has(key)) {
            const val = this.cache.get(key);
            this.updateKey(key, val);
            return val;
        }
        return null;
     }

     set(key, value) {
        if (this.cache.has(key)) {
            this.updateKey(key, value);
            return;
        }

        if (this.cache.size < this.capacity) {
            this.cache.set(key, value);
        } else {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
            this.cache.set(key, value)
        }
     }
}
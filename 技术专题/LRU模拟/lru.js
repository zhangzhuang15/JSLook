class LRU {
    constructor(capacity) {
        // 用来存储数据
        this.cache = {}
        // 用来控制数据的最近最少被使用的属性
        this.keys = []
        if(capacity === undefined || capacity <= 0) {
            this.capacity = 8
        } else {
            this.capacity = capacity
        }
    }

    get(key) {
        if(this.cache[key] !== undefined) {
            // 缓存命中，需要改变 key 在 keys中的顺序
            const index = this.keys.indexOf(key)
            this.keys.splice(index, 1)
            // 索引号越大，表示key越新鲜
            this.keys.push(key)
        }
        return this.cache[key]
    }

    set(key, value) {
        let oldValue
        if(this.cache[key] !== undefined) {
            // 缓存命中
            const index = this.keys.indexOf(key)
            this.keys.splice(index, 1)
            this.keys.push(key)
            oldValue = this.cache[key]
            this.cache[key] = value
        } else {
            if(this.keys.length >= this.capacity) {
                // 缓存已经满了，删除最近最少被使用的元素
                const oldKey = this.keys.shift()
                delete this.cache[oldKey]
            }
            this.keys.push(key)
            this.cache[key] = value
        }

        return oldValue
    }

    toString() {
        return this.keys.toString()
    }
}



module.exports = LRU
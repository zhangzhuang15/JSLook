## 说一下react组件通讯方式

## 说一下vitual dom 

## 说一下微前端

## 说一下微前端主站和子站之间如何通讯

## 用 tsx 编写一个树组件

## 给你一个字符串`"fdfaffffdfadf"`，找出出现次数最多的字符？如果出现次数最多的字符不止一种，如何把它们找出来？
```ts 
const getChar = (s: string) => {
    const map = new Map();
    const result: string[] = [];
    let maxVal = 0;

    for (const item of s) {
        if (map.has(item)) {
            map.set(item, map.get(item) + 1)
        } else {
            map.set(item, 1)
        }
    }

    for (const key of map.keys()) {
        const v = map.get(key)

        if (v > maxVal) {
            result.splice(0);
        }

        if (v >= maxVal) {
            maxVal = v 
            result.push(item);
        }
    }

    return result.join('')
}
```
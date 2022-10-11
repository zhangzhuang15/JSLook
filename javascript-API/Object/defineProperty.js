var dog = {
    name: "Mike",
    age: 4
};

console.log("dog: ", dog);

/**
 * 1、
 *  configurable?: boolean;
    enumerable?: boolean;

   2、
    value?: any;
    writable?: boolean;
   3、
    get?(): any;
    set?(v: any): void;

   只能选择2和3其中一组的属性进行设置，1无所谓。
 */
Object.defineProperty(dog, 
                     "color", 
                     {
                         configurable: true,  // false，将无法再修改 1、2、3组中任何一个属性
                         enumerable: false,    // false, color属性无法使用 for of 迭代, 打印的dog的时候也看不到
                         value: 'black',
                         writable: true
                     }
);

console.log("dog: ", dog);



Object.defineProperty(dog,
                      "food",
                      {
                          configurable: true,
                          enumerable: true,
                          set: function(value) {
                              dog.__proto__.food= value;
                          },
                          get: function() { return dog.__proto__.food}
                      }
);

dog["food"] = "noodles";

console.log("dog: ", dog);
console.log("dog['food']: ", dog['food']);
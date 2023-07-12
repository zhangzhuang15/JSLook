/**
 * 目的：
 *   1、展示class关键字如何使用
 *   2、探究class中的方法是否默认绑定 this
 */

class Person {
    /** version是 Person对象的属性 */
    version = "1.0.0";

    /** num是 Person的类属性 */
    static num = 0;

    /** showVersion是 Person对象的属性，只不过属性值是 函数类型 */
    showVersion = () => { console.log(`version: ${this.version}`);}
    
    /** showPersonCount是 Person类属性，只不过属性值是 函数类型 */
    static showPersonCount = () => { console.log(`Pepople Num: ${Person.num}`);}

    constructor(name, age){
        this.name = name;
        this.age = age;
        Person.num++;
    }

    showPersonalMessage(){
        console.log(`name: ${this.name}, age: ${this.age}`);
    }
}


var p = new Person('Ken', 15);
p.showPersonalMessage();
p.showVersion();
/** 类属性 只能使用 Person类调用，不能使用Person对象调用 */
Person.showPersonCount();
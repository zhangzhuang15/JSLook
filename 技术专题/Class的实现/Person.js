/**
 * 使用es5语法实现 class
 */

var Person = (function(){
    // class语法中，必须 new Person调用，不能直接调用Person
    function Person(name, age){
        if(__ClassCheck(this, Person) === false){
            throw TypeError("you must invoke new !");
        };
        this.name = name;
        this.age = age;
    }
    function __ClassCheck(target, Class){
        if(target !== null && typeof Symbol !== undefined && Class[Symbol.hasInstance]){
            return !!Class[Symbol.hasInstance](target);  
            // 双感叹号用于确保非boolean数据转换为boolean数据
            // Class[Symbol.hasInstance](target) 相当于 target instanceof Class
            // Symbol.hasInstance返回一个函数名，也就是Class的一个方法属性
        }else{
            return target instanceof Class;
        }
    }
    function addProperties(Constructor, instanceProperties, staticProperties){
        for(let i = 0; i < instanceProperties.length; i++){
            let descriiptor = instanceProperties[i];
            descriiptor.enumerable = descriiptor.enumerable || false;
            descriiptor.writable = true;
            descriiptor.configurable = true; 
            // 实例方法要让所有的实例共享，要绑定在原型上
            Object.defineProperty(Constructor.prototype, descriiptor.key, descriiptor);
        }
        for(let i = 0 ; i < staticProperties.length; i++){
            let descriiptor = staticProperties[i];
            descriiptor.enumerable = descriiptor.enumerable || false;
            descriiptor.writable = true;
            descriiptor.configurable = true;
            // 静态方法要绑定在Constructor
            Object.defineProperty(Constructor, descriiptor.key, descriiptor);
            
        }
    }
    addProperties(Person, [{ key: "getName", value: function(){return this.name;}}], 
    [{ key: 'isPerson', value: function(target){ return target instanceof Person;}}]);
    return Person;
})();

module.exports = Person;
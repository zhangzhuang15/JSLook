// 模拟 call 方法

var obj = { name: "jack"};

var func = function() { console.log(this.name);}

func.call(obj); // "jack"


Function.prototype.mycall = function(newArg, args) {
    // 为了简单说明最基本的原理，这里不加入newArg的数据校验处理，
    // 直接认为 newArg是合法对象；参数args也是如此。
    // this 指向的就是调用 mycall的函数本身，不要忘了，函数本身也是对象！
    newArg["fn"] = this;
    newArg["fn"](args);
    // 必须使用delete删除属性，否则newArg的实参会多出来一个"fn"属性
    delete newArg["fn"];
}

func.mycall(obj, null); // "jack"


// 改变函数内部this指针的原理如下
global.name = "Julie";
var p = function(e) { console.log(this.name);}
var member = {
    "name": "Jacson",
    "print": p
};
p(); // Julie
member.print(); // Jacson

// func.call(obj, ...args) 的关键作用就是将func函数中的this修正为obj对象.
// 原理就像上边代码所示，只要将 func函数设置为 obj的成员即可，所以才有了 newArg["fn"] = this, this 指的就是函数 func。
// 只要将一个函数作为一个对象的成员方法，那么函数内部的this指针就指向那个对象了
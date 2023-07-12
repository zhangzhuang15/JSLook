const wset = new WeakSet();

/**
 * WeakSet只能存储对象，不能存储基础值
 */
// wset.add("Mac");      
// console.log("wset has 'Mac' ? ", wset.has("Mac"));
// wset.delete("Mac");
// console.log("wset has 'Mac' ? ", wset.has('Mac'));

var body = { height: 182, weight: 70};
wset.add(body);
console.log("wset has body ? ", wset.has(body)); // true
wset.delete(body);
setTimeout(() => { body = null; console.log(wset)}, 2000);

